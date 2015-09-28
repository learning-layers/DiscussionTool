'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:EntryEditModalCtrl
 * @description
 * # EntryEditModalCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('EntryEditModalCtrl', function ($scope, $q, $modalInstance, discussion, entry, episodesService, entitiesService, tagsService, discussionsService, messagesService) {
    var episode = $scope._(discussion.targets).find(function (target) { return target.type === 'learnEp'; });

    $scope.isBeingSubmitted = false;

    $scope.entry = {
      description: entry.content,
      tags: $scope._(entry.tags).map(function(tag) { return tag.label; }),
      entities: $scope._(entry.attachedEntities).map(function (entity) { return entity.id; })
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
      if ( !$scope.edit_entry_form.$valid ) {
        $scope.edit_entry_form.modal_description.$dirty = true;
        return;
      }

      $scope.isBeingSubmitted = true;

      // Determine which entities were added/removed
      var previousEntities = [];
      angular.forEach(entry.attachedEntities, function (entity) {
        previousEntities.push(entity.id);
      });
      var currentEntities = $scope.entry.entities;

      var entitiesToRemove = $scope._(previousEntities).difference(currentEntities);
      var entitiesToAttach = $scope._(currentEntities).difference(previousEntities);

      // Update discussion
      discussionsService.updateEntry({
        entry: encodeURIComponent(entry.id)
      }, {
        content: $scope.entry.description,
        entitiesToRemove: entitiesToRemove,
        entitiesToAttach: entitiesToAttach
      }, function() {
        // Determine which tags were added/removed
        var previousTags = [];
        angular.forEach(entry.tags, function (tag) {
          previousTags.push(tag.label);
        });
        var currentTags = [];
        angular.forEach($scope.entry.tags, function (tag) {
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
              entity: entry.id,
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
              entity: encodeURIComponent(entry.id)
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
            setAttachedEntities: true,
            setEntries: true,
          }, function (disc) {
            var updatedEntry = $scope._(disc.entries).find(function (single) { return single.id === entry.id; });

            entry.content = updatedEntry.content;
            entry.tags = updatedEntry.tags;
            entry.attachedEntities = updatedEntry.attachedEntities;
          });

          $scope.isBeingSubmitted = false;
          $modalInstance.close();
          messagesService.addSuccess('Entry updated successfully.');
        }, function() {
          $scope.isBeingSubmitted = false;
          messagesService.addSuccess('Entry updated successfully.');
          messagesService.addWarning('At least one of the tags could not be added or removed.');
          $modalInstance.close();
        });
      }, function() {
        $scope.isBeingSubmitted = false;
        messagesService.addDanger('Entry could not be updated. Service responded with an error!');
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
