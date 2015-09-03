'use strict';

/**
 * @ngdoc directive
 * @name discussionToolApp.directive:livingDocuments
 * @description
 * # livingDocuments
 */
angular.module('discussionToolApp')
  .directive('livingDocuments', function ($modal, discussionsService, livingDocumentsService) {
    return {
      templateUrl: 'views/templates/living_documents.html',
      restrict: 'E',
      scope: {
        discussion: '=discussion'
      },
      link: function postLink(scope) {
        scope.hasLivingDocument = function () {
          return !!scope.getLivingDocument();
        };

        scope.getLivingDocument = function () {
          return discussionsService.getLivingDocument(scope.discussion);
        };

        scope.openLivingDocumentsModal = function () {
          var modalInstance = $modal.open({
            templateUrl: 'views/living_documents_modal.html',
            controller: 'LivingDocumentsModalCtrl',
            size: 'lg',
            resolve: {
              documents: function () {
                return livingDocumentsService.query();
              }
            }
          });

          modalInstance.result.then(function (document) {
            // XXX Need to also handle errors
            // Probably display a message of something failing
            discussionsService.addTargets({
              discussion: encodeURIComponent(scope.discussion.id),
              targets: encodeURIComponent(document.id)
            }, {}, function () {
              scope.discussion.targets.push(document);
            });
          });
        };
      }
    };
  });
