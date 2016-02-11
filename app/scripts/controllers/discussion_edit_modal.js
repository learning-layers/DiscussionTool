'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:DiscussionEditModalCtrl
 * @description
 * # DiscussionEditModalCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('DiscussionEditModalCtrl', function ($scope, $q, $modalInstance, discussion, episodesService, entitiesService, tagsService, discussionsService, messagesService) {
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

      // Determine which entities were added/removed
      var previousEntities = [];
      angular.forEach(discussion.attachedEntities, function (entity) {
        previousEntities.push(entity.id);
      });
      var currentEntities = $scope.discussion.entities;

      var entitiesToRemove = $scope._(previousEntities).difference(currentEntities);
      var entitiesToAttach = $scope._(currentEntities).difference(previousEntities);

      var updatedData = {
        entitiesToRemove: entitiesToRemove,
        entitiesToAttach: entitiesToAttach
      };

      if ( $scope.discussion.label !== discussion.label ) {
        updatedData.label = $scope.discussion.label;
      }

      if ( $scope.discussion.description !== discussion.description ) {
        updatedData.content = $scope.discussion.description;
      }

      // Update discussion
      discussionsService.update({
        disc: encodeURIComponent(discussion.id)
      }, updatedData, function() {
        // Determine which tags were added/removed
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

        // Add/remove tags if needed and extract promises
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
          discussionsService.queryFilteredDiscussion({
            disc: encodeURIComponent(discussion.id)
          },
          {
            setTags: true,
            setAttachedEntities: true
          }, function (disc) {
            discussion.label = disc.label;
            discussion.description = disc.description;
            discussion.tags = disc.tags;
            discussion.attachedEntities = disc.attachedEntities;
          });

          $scope.isBeingSubmitted = false;
          $modalInstance.close();
          messagesService.addSuccess('Discussion updated successfully.');
        }, function() {
          $scope.isBeingSubmitted = false;
          messagesService.addSuccess('Discussion updated successfully.');
          messagesService.addWarning('At least one of the tags could not be added or removed.');
          $modalInstance.close();
        });
      }, function() {
        $scope.isBeingSubmitted = false;
        messagesService.addDanger('Discussion could not be updated. Service responded with an error!');
      });
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
