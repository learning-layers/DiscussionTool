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

    $scope.getUnreadEntriesCount = function (discussion) {
      if ( discussion.entries.length === 0 ) {
        return 0;
      }

      var groupedCounts = this._(discussion.entries).countBy(function (entry) {
        return entry.read ? 'read' : 'unread';
      });

      if ( groupedCounts.unread && groupedCounts.unread > 0 ) {
        return groupedCounts.unread;
      }

      return 0;
    };

    $scope.hasUnreadEntries = function (discussion) {
      if ( discussion.entries.length === 0 ) {
        return false;
      }

      if ( this.getUnreadEntriesCount(discussion) > 0 ) {
        return true;
      }

      return false;
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
        setEntries: true,
        setReads: true
      }, function (discussions) {
        $scope.discussions = discussions;
        $scope.discussions.$promise.finally(function () {
          $scope.discussionsLoaded = true;
        });
      });
    }

  });
