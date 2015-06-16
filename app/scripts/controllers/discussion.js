'use strict';

/**
 * @ngdoc function
 * @name discussionsApp.controller:DiscussionCtrl
 * @description
 * # DiscussionCtrl
 * Controller of the discussionsApp
 */
angular.module('discussionsApp')
  .controller('DiscussionCtrl', function ($scope, $rootScope, $location, helpers, authService, entityService, discService, tagService) {
    $scope.entity = null;
    $scope.discs = [];

    if (authService.isLoggedIn()) {
      $scope.entity = entityService.get({
        id: authService.getEntityId()
      });
      $scope.discussions = discService.query(function() {
        angular.forEach($scope.discussions, function(discussion) {
          // Fetch and inject author
          // XXX This is needed because the provided one is incomplete
          entityService.get({
            id: helpers.getIdFromUri(discussion.author.id)
          }, function(author) {
            discussion.author = author;
          });
          // Fetch and inject tags
          tagService.queryAssignments({
            entities: [helpers.getIdFromUri(discussion.id)]
          }, function(tags) {
            if ( tags ) {
              angular.forEach(tags, function(tag) {
                discussion.tags.push(tag);
              });
            }
          });
        });
      });
    }

    $scope.getIconClass = function(entity) {
      return helpers.getEntityIconClass(entity);
    };

    $scope.startDiscussion = function() {
      $location.path('/discussion/create');
    };

    $scope.addLike = function(discussion, event) {
      console.log('like', discussion, event);
      // TODO Use directive instead
      angular.element(event.currentTarget).blur();
      // TODO Implement
    };

    $scope.addDislike = function(discussion, event) {
      console.log('dislike', discussion, event);
      // TODO Use directive instead
      angular.element(event.currentTarget).blur();
      // TODO Implement
    };
  });
