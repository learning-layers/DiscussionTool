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
      return discussionsService.getLivingDocument($scope.discussion);
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
      return episodesService.isEpisode($scope.targetEntity);
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

      episodesService.queryVersionAndFillScope(targetUri, $scope);
    });
  });
