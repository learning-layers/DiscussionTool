'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:DiscussionViewCtrl
 * @description
 * # DiscussionViewCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('DiscussionViewCtrl', function ($rootScope, $scope, $routeParams, $modal, $q, discussionsService, livingDocumentsService, entitiesService, episodesService, tagsService) {
    var targetUri = decodeURIComponent($routeParams.target);
    $rootScope.targetEntityUri = targetUri;

    var discussionUri = decodeURIComponent($routeParams.discussion);

    var isBeingSubmitted = false;

    function isInsideCircle (x, y, circle) {
      var cx = circle.xC,
          cy = circle.yC,
          rx = circle.xR,
          ry = circle.yR,
          inside = Math.pow(((x-cx)/rx),2) + Math.pow(((y-cy)/ry),2);

      return (inside <= 1) ? true : false;
    }

    $scope.answer = {
      description: '',
      tags: [],
      entities: []
    };
    $scope.standaloneEntities = [];
    $scope.tagFrequencies = {};
    $scope.tagAutocomplete = $q.defer();

    $scope.hasLivingDocument = function () {
      return !!$scope.getLivingDocument();
    };

    $scope.getLivingDocument = function () {
      if ( !$scope.discussion ) {
        return null;
      }
      return $scope._($scope.discussion.targets).find(function (target) { return target.type === 'livingDoc'; });
    };

    $scope.openLivingDocumentsModal = function () {
      var modalInstance = $modal.open({
        templateUrl: 'views/living_documents_modal.html',
        controller: 'LivingDocumentsModalCtrl',
        size: 'lg',
        resolve: {
          documents: function () {
            return livingDocumentsService.query();
          }
        }
      });

      modalInstance.result.then(function (document) {
        // XXX Need to also handle errors
        // Probably display a message of something failing
        discussionsService.addTargets({
          discussion: encodeURIComponent($scope.discussion.id),
          targets: encodeURIComponent(document.id)
        }, {}, function () {
          $scope.discussion.targets.push(document);
        });
      });
    };

    $scope.isBeingSubmitted = function () {
      return isBeingSubmitted;
    };

    $scope.isEpisode = function () {
      if ( $scope.targetEntity ) {
        return ($scope.targetEntity.type === 'learnEp') ? true : false;
      }

      return false;
    };

    $scope.isInsideCircle = function(entity, circle) {
      return isInsideCircle(entity.x, entity.y, circle);
    };

    $scope.isOrphaned = function(entity) {
      if ( $scope.standaloneEntities.indexOf(entity.id) !== -1 ) {
        return true;
      }

      return false;
    };

    $scope.addToTags = function(element, event) {
      if ( !$scope._($scope.answer.tags).find(function(tag) { return tag.text === element.label; }) ) {
        $scope.answer.tags.push({
          text: element.label
        });
      }
      // TODO Use directive instead
      angular.element(event.currentTarget).blur();
    };

    $scope.getTagAutocomplete = function() {
      return $scope.tagAutocomplete.promise;
    };

    $scope.calculateFontSize = function(element) {
      var fontMin = 15,
          fontMax = 20,
          frequ = element.frequ;
      return (frequ === $scope.minFrequency) ? fontMin : (frequ / $scope.maxFrequency) * (fontMax - fontMin) + fontMin;
    };

    $scope.doSubmit = function() {
      isBeingSubmitted = true;

      discussionsService.saveEntry({
        entry: $scope.answer.description,
        entities: $scope.answer.entities,
        disc: $scope.discussion.id,
        type: 'qaEntry',
        addNewDisc: false
      }, function(response) {
        var promises = [];
        angular.forEach($scope.answer.tags, function(tag) {
          var promise = tagsService.addToEntity({}, {
            label: tag.text,
            entity: response.entry,
            space: 'sharedSpace'
          }, function() {
          }).$promise;
          promises.push(promise);
        });
        // Navigate away when all promises resolve
        $q.all(promises).then(function() {
          isBeingSubmitted = false;
          $scope.answer.description = '';
          $scope.answer.tags = [];
          $scope.answer.entities = [];

          // Fetch discussion and set entries
          discussionsService.queryFilteredDiscussion({
            disc: encodeURIComponent(discussionUri)
          },
          {
            setLikes: true,
            setEntries: true,
            setTags: true,
            setAttachedEntities: true
          }, function (discussion) {
            $scope.discussion.entries = discussion.entries;
          });
        });
      }, function() {
        isBeingSubmitted = false;
        // XXX Need to show some message to indicate that call failed
      });
    };

    // Loading and initializing
    discussionsService.queryFilteredDiscussion({
      disc: encodeURIComponent(discussionUri)
    },
    {
      setLikes: true,
      setEntries: true,
      setTags: true,
      setAttachedEntities: true
    }, function (discussion) {
      $scope.discussion = discussion;
    });

    entitiesService.queryFiltered({
      entities: encodeURIComponent(targetUri)
    },
    {}, function (entities) {
      if ( entities.length > 0 ) {
        $scope.targetEntity = entities[0];
      }

      if ( $scope.isEpisode() === false ) {
        return;
      }

      episodesService.queryVersions({
        episode: encodeURIComponent($scope.targetEntity.id)
      }, function (versions) {
        if ( versions.length === 0) {
          return;
        }

        $scope.episodeVersion = versions[0];
        var tmpTagAutoComplete = [];
        angular.forEach($scope.episodeVersion.learnEpEntities, function (entity) {
          var contained = false;

          angular.forEach($scope.episodeVersion.learnEpCircles, function (circle) {
            if ( isInsideCircle(entity.x, entity.y, circle) ) {
              contained = true;
            }
          });

          if ( !contained ) {
            $scope.standaloneEntities.push(entity.id);
          }

          // Add unique tags to be pushed into autocomplete later
          if ( entity.entity && entity.entity.tags.length > 0 ) {
            angular.forEach(entity.entity.tags, function (tag) {
              if ( tmpTagAutoComplete.indexOf(tag.label) === -1 ) {
                tmpTagAutoComplete.push(tag.label);
              }
              if ( $scope.tagFrequencies[tag.label] ) {
                $scope.tagFrequencies[tag.label].frequ += 1;
              } else {
                $scope.tagFrequencies[tag.label] = {
                  label: tag.label,
                  frequ: 1
                };
              }
            });
          }
        });
        // Set autocomplete
        if ( tmpTagAutoComplete.length > 0 ) {
          $scope.tagAutocomplete.resolve(tmpTagAutoComplete);

          $scope.maxFrequency = $scope._($scope.tagFrequencies).max(function(frequency) {
            return frequency.frequ;
          }).frequ;
          $scope.minFrequency = $scope._($scope.tagFrequencies).min(function(frequency) {
            return frequency.frequ;
          }).frequ;
        } else {
          $scope.tagAutocomplete.reject([]);
        }
      });
    });
  });
