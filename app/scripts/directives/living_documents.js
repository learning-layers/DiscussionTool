'use strict';

/**
 * @ngdoc directive
 * @name discussionToolApp.directive:livingDocuments
 * @description
 * # livingDocuments
 */
angular.module('discussionToolApp')
  .directive('livingDocuments', function ($rootScope, $modal, config, discussionsService, livingDocumentsService, messagesService) {
    return {
      templateUrl: 'views/templates/living_documents.html',
      restrict: 'E',
      scope: {
        discussion: '=discussion'
      },
      link: function postLink(scope) {
        scope.popoverTemplateUrl = 'views/templates/popover.html';

        scope.hasLivingDocument = function () {
          return !!scope.getLivingDocument();
        };

        scope.getLivingDocument = function () {
          return discussionsService.getLivingDocument(scope.discussion);
        };

        scope.openDocument = function () {
          var ld = this.getLivingDocument();
          if ( ld ) {
            if ( livingDocumentsService.getAuthenticated() === true ) {
              window.open(livingDocumentsService.constructClientUrlFromUri(ld.id));
            } else {
              var openedWindow = window.open();

              livingDocumentsService.authenticate({
                forceUpdate: true
              }, function () {
                livingDocumentsService.setAuthenticated(true);
                openedWindow.location.replace(livingDocumentsService.constructClientUrlFromUri(ld.id));
              }, function() {
                openedWindow.close();
              });
            }
          }
        };

        scope.openLivingDocumentsModal = function () {
          var modalInstance = $modal.open({
            templateUrl: 'views/living_documents_modal.html',
            controller: 'LivingDocumentsModalCtrl',
            size: 'lg',
            resolve: {
              documents: function () {
                return livingDocumentsService.queryFiltered({
                  setDiscs: true
                });
              },
              discussion: function() {
                return scope.discussion;
              }
            }
          });

          modalInstance.result.then(function (document) {
            if ( !document ) {
              return;
            }
            discussionsService.queryFilteredByTarget({
              target: encodeURIComponent(document.id)
            }, {}, function(discussions) {
              if ( discussions.length === 0 ) {
                discussionsService.addTargets({
                  discussion: encodeURIComponent(scope.discussion.id),
                  targets: encodeURIComponent(document.id)
                }, {}, function () {
                  scope.discussion.targets.push(document);
                }, function () {
                  messagesService.addDanger('LivingDocument could not be added to a discussion. Server responsed with an error!');
                });
              } else if ( $rootScope._(discussions[0].targets).find(function (target) { return target.id === document.id; }) ) {
                scope.discussion.targets.push(document);
              } else {
                messagesService.addDanger('This discussion already has a LivingDocument attached.');
              }
            });
          });
        };
      }
    };
  });
