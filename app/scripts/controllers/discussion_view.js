'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:DiscussionViewCtrl
 * @description
 * # DiscussionViewCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('DiscussionViewCtrl', function ($rootScope, $scope, $routeParams, discussionsService) {
    var targetUri = decodeURIComponent($routeParams.target);
    $rootScope.targetEntityUri = targetUri;

    var discussionUri = decodeURIComponent($routeParams.discussion);

    // Loading and initializing
    discussionsService.queryFilteredDiscussion({
      disc: encodeURIComponent(discussionUri)
    },
    {
      setLikes: true,
      setEntries: true,
      setTags: true,
      setAttachedEntities: true
    }, function (discussion) {
      $scope.discussion = discussion;
    });
  });
