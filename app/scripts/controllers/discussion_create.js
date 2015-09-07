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
      episodesService.queryVersionAndFillScope($scope.targetEntity.id, $scope);
    });
  });
