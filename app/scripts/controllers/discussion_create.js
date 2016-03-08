'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:DiscussionCreateCtrl
 * @description
 * # DiscussionCreateCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('DiscussionCreateCtrl', function ($rootScope, $scope, $location, $q, $routeParams, entitiesService, episodesService, discussionsService, tagsService, messagesService) {
    var targetUri = decodeURIComponent($routeParams.target);
    $scope.setTargetEntityUri(targetUri);

    var isBeingSubmitted = false;

    function handleDiscussionCreated(tagsAdded) {
      isBeingSubmitted = false;
      messagesService.addSuccess('You have successfully created a new discussion.');
      if ( tagsAdded !== true ) {
        messagesService.addWarning('At least one of the tags could not be added to the newly created discussion.');
      }
      $location.path('/discussions/' + encodeURIComponent(targetUri) + '/list');
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
      return episodesService.isEpisode($scope.targetEntity);
    };

    $scope.doCancel = function () {
      $location.path('/discussions/' + encodeURIComponent(targetUri) + '/list');
    };

    $scope.doSubmit = function() {
      if ( !$scope.create_discussion_form.$valid ) {
        $scope.create_discussion_form.label.$dirty = true;
        $scope.create_discussion_form.description.$dirty = true;
        return;
      }

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
          }, function() {
            //messagesService.addDanger('One of the tags could not be added the discussion.');
          }).$promise;
          promises.push(promise);
        });

        // Attach LD to Discussion
        var attachLDPromise = discussionsService.addTargets({
          discussion: encodeURIComponent(response.disc),
          targets: encodeURIComponent($rootScope.targetEntityLivingDocumentUri)
        }, {}, function () {
        }, function () {
          messagesService.addDanger('LivingDocument could not be added to a discussion. Server responsed with an error!');
        });
        promises.push(attachLDPromise);

        // Navigate away when all promises resolve
        $q.all(promises).then(function() {
          handleDiscussionCreated(true);
        }, function() {
          handleDiscussionCreated(false);
        });
      }, function() {
        isBeingSubmitted = false;
        messagesService.addDanger('Discussion could not be created. Server responded with an error!');
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
      episodesService.queryVersionAndFillScope($scope.targetEntity.id, $scope, 'discussionCreate');
    });
  });
