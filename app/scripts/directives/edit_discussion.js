'use strict';

/**
 * @ngdoc directive
 * @name discussionToolApp.directive:editDiscussion
 * @description
 * # editDiscussion
 */
angular.module('discussionToolApp')
  .directive('editDiscussion', function ($modal, authService) {
    return {
      templateUrl: 'views/templates/edit_discussion.html',
      restrict: 'E',
      scope: {
        discussion: '=discussion'
      },
      link: function postLink(scope) {
        scope.canEdit = function () {
          return authService.getUserUri() === scope.discussion.author.id;
        };

        scope.reloadRecommendations = function() {
          if ( typeof scope.$parent.$parent.reloadRecommendations === 'function' ) {
            scope.$parent.$parent.reloadRecommendations();
          }
        };

        scope.openEditModal = function () {
          var modalInstance = $modal.open({
            templateUrl: 'views/discussion_edit_modal.html',
            controller: 'DiscussionEditModalCtrl',
            size: 'lg',
            resolve: {
              discussion: function() {
                return scope.discussion;
              },
              reloadRecommendations: function() {
                return scope.reloadRecommendations;
              }
            }
          });

          modalInstance.result.then(function () {
            // Do nothing
          });
        };
      }
    };
  });
