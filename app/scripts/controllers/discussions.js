'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:DiscussionsCtrl
 * @description
 * # DiscussionsCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('DiscussionsCtrl', function ($rootScope, $scope, $location, $routeParams, discussionsService, entitiesService) {
    var targetUri = decodeURIComponent($routeParams.target);
    $scope.setTargetEntityUri(targetUri);

    $scope.getDiscussionUrl = function (discussion) {
      return '#/discussions/' + encodeURIComponent(encodeURIComponent(targetUri)) + '/discussion/' + encodeURIComponent(encodeURIComponent(discussion.id));
    };

    $scope.startNewDiscussion = function () {
      $location.path('discussions/' + encodeURIComponent(targetUri) + '/discussion/create');
    };

    // Loading and setting logical block
    if ( $scope.isLoggedIn() ) {
      entitiesService.queryFiltered({
        entities: encodeURIComponent(targetUri)
      },
      {}, function (entities) {
       if ( entities.length > 0 ) {
         $scope.targetEntity = entities[0];
       }
      });

      discussionsService.queryFilteredByTarget({
        target: encodeURIComponent(targetUri)
      },
      {
        setLikes: true,
        setTags: true,
        setAttachedEntities: true,
        setEntries: true
      }, function (discussions) {
        $scope.discussions = discussions;
        $scope.discussions.$promise.finally(function () {
          $scope.discussionsLoaded = true;
        });
      });
    }

  });
