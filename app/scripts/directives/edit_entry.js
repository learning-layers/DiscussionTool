'use strict';

/**
 * @ngdoc directive
 * @name discussionToolApp.directive:editEntry
 * @description
 * # editEntry
 */
angular.module('discussionToolApp')
  .directive('editEntry', function ($modal, authService) {
    return {
      templateUrl: 'views/templates/edit_entry.html',
      restrict: 'E',
      scope: {
        discussion: '=discussion',
        entry: '=entry'
      },
      link: function postLink(scope) {
        scope.canEdit = function () {
          return authService.getUserUri() === scope.entry.author.id;
        };

        scope.openEditModal = function () {
          var modalInstance = $modal.open({
            templateUrl: 'views/entry_edit_modal.html',
            controller: 'EntryEditModalCtrl',
            size: 'lg',
            resolve: {
              discussion: function () {
                return scope.discussion;
              },
              entry: function () {
                return scope.entry;
              }
            }
          });

          modalInstance.result.then(function () {
            // Do nothing for now
          });
        };
      }
    };
  });
