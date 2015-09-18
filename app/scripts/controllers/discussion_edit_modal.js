'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:DiscussionEditModalCtrl
 * @description
 * # DiscussionEditModalCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('DiscussionEditModalCtrl', function ($scope, $q, $modalInstance, discussion, episodesService, entitiesService, tagsService, discussionsService) {
    var episode = $scope._(discussion.targets).find(function (target) { return target.type === 'learnEp'; });

    $scope.isBeingSubmitted = false;

    $scope.discussion = {
      label: discussion.label,
      description: discussion.description,
      tags: $scope._(discussion.tags).map(function(tag) { return tag.label; }),
      entities: $scope._(discussion.attachedEntities).map(function (entity) { return entity.id; })
    };

    $scope.standaloneEntities = [];
    $scope.tagFrequencies = {};
    $scope.tagAutocomplete = $q.defer();

    // Prevent Modal from closing if being submitted
    $scope.$on('modal.closing', function (event) {
      if ( $scope.isBeingSubmitted ) {
        event.preventDefault();
      }
    });

    $scope.isEpisode = function () {
      return episodesService.isEpisode(episode);
    };

    $scope.doSubmit = function () {
      if ( !$scope.edit_discussion_form.$valid ) {
        $scope.edit_discussion_form.modal_label.$dirty = true;
        $scope.edit_discussion_form.modal_description.$dirty = true;
        return;
      }

      $scope.isBeingSubmitted = true;

      var previousTags = [];
      angular.forEach(discussion.tags, function (tag) {
        previousTags.push(tag.label);
      });
      var currentTags = [];
      angular.forEach($scope.discussion.tags, function (tag) {
        currentTags.push(tag.text);
      });

      var addedTags = $scope._(currentTags).difference(previousTags);
      var removedTags = $scope._(previousTags).difference(currentTags);

      var promises = [];
      if ( addedTags.length > 0 ) {
        angular.forEach(addedTags, function(tag) {
          var promise = tagsService.addToEntity({}, {
            label: tag,
            entity: discussion.id,
            space: 'sharedSpace'
          }, function() {
          }, function() {
            //messagesService.addDanger('One of the tags could not be added the discussion.');
          }).$promise;
          promises.push(promise);
        });
      }
      if ( removedTags.length > 0 ) {
        angular.forEach(removedTags, function(tag) {
          var promise = tagsService.removeFromEntity({
            entity: encodeURIComponent(discussion.id)
          }, {
            label: tag,
            space: 'sharedSpace'
          }, function() {
          }, function() {
            //messagesService.addDanger('One of the tags could not be added the discussion.');
          }).$promise;
          promises.push(promise);
        });
      }
      // Finish when all promises resolve
      $q.all(promises).then(function() {
        $scope.isBeingSubmitted = false;
        $modalInstance.close();
        discussionsService.queryFilteredDiscussion({
          disc: encodeURIComponent(discussion.id)
        },
        {
          setLikes: true,
          setEntries: true,
          setTags: true,
          setAttachedEntities: true
        }, function (disc) {
          discussion.tags = disc.tags;
        });
      }, function() {
        $scope.isBeingSubmitted = false;
        $modalInstance.close();
      });

      // TODO
      // Make sure discussion is updated

      // XXX Save logic missing
    };

    $scope.doCancel = function () {
      $modalInstance.dismiss('closed');
    };

    // Loading and initializing
    if ( episode ) {
      entitiesService.queryFiltered({
        entities: encodeURIComponent(episode.id)
      },
      {}, function (entities) {
        if ( entities.length > 0 ) {
          $scope.targetEntity = entities[0];
        }

        if ( $scope.isEpisode() === false ) {
          return;
        }
        episodesService.queryVersionAndFillScope(episode.id, $scope);
      });
    }
  });
