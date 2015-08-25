'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:DiscussionsCtrl
 * @description
 * # DiscussionsCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('DiscussionsCtrl', function ($scope, discussionsService) {
    var targetUri = 'http://sss.eu/2872864790100841';

    discussionsService.queryByTarget({
      target: encodeURIComponent(targetUri)
    }, function(discussions) {
      $scope.discussions = discussions;
    });
  });
