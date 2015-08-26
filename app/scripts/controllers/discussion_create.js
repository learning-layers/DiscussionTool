'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:DiscussionCreateCtrl
 * @description
 * # DiscussionCreateCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('DiscussionCreateCtrl', function ($scope, $location, $q, entitiesService, episodesService, discussionsService, tagsService) {
    // XXX This should be loaded form some place
    var targetUri = 'http://sss.eu/2872864790100841';
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
    $scope.tagCloud = [];
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

    $scope.getTagAutocomplete = function() {
      return $scope.tagAutocomplete.promise;
    };

    $scope.doCancel = function () {
      $location.path('/');
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
          $location.path('/');
        });
      }, function() {
        isBeingSubmitted = false;
      });
    };

    // Loading and initializing
    entitiesService.queryFiltered({
      entitites: encodeURIComponent(targetUri)
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
        angular.forEach($scope.episodeVersion.learnEpEntities, function(entity) {
          var contained = false;

          angular.forEach($scope.episodeVersion.learnEpCircles, function(circle) {
            if ( isInsideCircle(entity.x, entity.y, circle) ) {
              contained = true;
            }
          });

          if ( !contained ) {
            $scope.standaloneEntities.push(entity.id);
          }
        });
      });
    });
  });
