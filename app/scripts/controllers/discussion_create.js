'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:DiscussionCreateCtrl
 * @description
 * # DiscussionCreateCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('DiscussionCreateCtrl', function ($rootScope, $scope, $location, $q, $routeParams, entitiesService, episodesService, discussionsService, tagsService) {
    var targetUri = decodeURIComponent($routeParams.target);

    $rootScope.targetEntityUri = targetUri;

    var isBeingSubmitted = false;

    function isInsideCircle (x, y, circle) {
      var cx = circle.xC,
          cy = circle.yC,
          rx = circle.xR,
          ry = circle.yR,
          inside = Math.pow(((x-cx)/rx),2) + Math.pow(((y-cy)/ry),2);

      return (inside <= 1) ? true : false;
    }

    $scope.discussion = {
      label: '',
      description: '',
      tags: [],
      entities: []
    };
    $scope.standaloneEntities = [];
    $scope.tagFrequencies = {};
    $scope.tagAutocomplete = $q.defer();

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
      if ( !$scope._($scope.discussion.tags).find(function(tag) { return tag.text === element.label; }) ) {
        $scope.discussion.tags.push({
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

    $scope.doCancel = function () {
      $location.path('/discussions/' + encodeURIComponent(targetUri) + '/list');
    };

    $scope.doSubmit = function() {
      isBeingSubmitted = true;

      discussionsService.save({
        label: $scope.discussion.label,
        description: $scope.discussion.description,
        entities: $scope.discussion.entities,
        targets: [$scope.targetEntity.id],
        type: 'qa',
        addNewDisc: true
      }, function(response) {
        var promises = [];
        angular.forEach($scope.discussion.tags, function(tag) {
          var promise = tagsService.addToEntity({}, {
            label: tag.text,
            entity: response.disc,
            space: 'sharedSpace'
          }, function() {
          }).$promise;
          promises.push(promise);
        });
        // Navigate away when all promises resolve
        $q.all(promises).then(function() {
          isBeingSubmitted = false;
          $location.path('/discussions/' + encodeURIComponent(targetUri) + '/list');
        });
      }, function() {
        isBeingSubmitted = false;
      });
    };

    // Loading and initializing
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
                  freqy: 1
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
