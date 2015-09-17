'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:DiscussionEditModalCtrl
 * @description
 * # DiscussionEditModalCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('DiscussionEditModalCtrl', function ($scope, $q, discussion, episodesService, entitiesService) {
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

      // XXX Save logic missing
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
