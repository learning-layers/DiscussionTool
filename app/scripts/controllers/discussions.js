'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:DiscussionsCtrl
 * @description
 * # DiscussionsCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('DiscussionsCtrl', function ($scope, $location, discussionsService, entitiesService) {
    // XXX This should be loaded form some place
    var targetUri = 'http://sss.eu/2872864790100841';

    $scope.startNewDiscussion = function () {
      $location.path('discussions/discussion/create');
    };

    // Loading and setting logical block
    if ( $scope.isLoggedIn() ) {
      entitiesService.queryFiltered({
        entitites: encodeURIComponent(targetUri)
      },
      {}, function (entities) {
       if ( entities.length > 0 ) {
         $scope.targetEntity = entities[0];
       }
      });

      discussionsService.queryByTarget({
        target: encodeURIComponent(targetUri)
      }, function (discussions) {
        $scope.discussions = discussions;
      });
    }

  });
