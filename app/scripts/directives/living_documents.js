'use strict';

/**
 * @ngdoc directive
 * @name discussionToolApp.directive:livingDocuments
 * @description
 * # livingDocuments
 */
angular.module('discussionToolApp')
  .directive('livingDocuments', function ($rootScope, $modal, config, discussionsService, livingDocumentsService, messagesService, evalLogsService) {
    return {
      templateUrl: 'views/templates/living_documents.html',
      restrict: 'E',
      scope: {
        discussion: '=discussion'
      },
      link: function postLink(scope) {
        scope.popoverTemplateUrl = 'views/templates/popover.html';
        scope.modalOpeningDisabled = false;

        scope.getDocumentColor = function() {
          if ( scope.hasLivingDocument() ) {
            return livingDocumentsService.getColoHashFromUri(scope.getLivingDocument().id);
          }

          return '#fff';
        };

        scope.isModalOpeningDisabled = function () {
          return scope.modalOpeningDisabled;
        };

        scope.hasLivingDocument = function () {
          return !!scope.getLivingDocument();
        };

        scope.getLivingDocument = function () {
          return discussionsService.getLivingDocument(scope.discussion);
        };

        scope.openDocument = function () {
          var ld = this.getLivingDocument();
          if ( ld ) {
            evalLogsService.log({}, {
              type: evalLogsService.logTypes.OPENLIVINGDOCUMENTS,
              entity: ld.id,
              entities: [$rootScope.targetEntityUri, scope.discussion.id]
            });

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
                  setDiscs: false
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

            scope.modalOpeningDisabled = true;

            discussionsService.queryFilteredByTarget({
              target: encodeURIComponent(document.id)
            }, {}, function(discussions) {
              var currentDiscussion = $rootScope._(discussions).find(function (discussion) { return discussion.id === scope.discussion.id; });

              // This handles case of document creation and already being connected
              if ( currentDiscussion ) {
                scope.discussion.targets.push(document);
              } else {
                discussionsService.addTargets({
                  discussion: encodeURIComponent(scope.discussion.id),
                  targets: encodeURIComponent(document.id)
                }, {}, function () {
                  scope.discussion.targets.push(document);
                  scope.modalOpeningDisabled = false;
                }, function () {
                  scope.modalOpeningDisabled = false;
                  messagesService.addDanger('LivingDocument could not be added to a discussion. Server responsed with an error!');
                });
              }
            }, function () {
              scope.modalOpeningDisabled = false;
              messagesService.addDanger('LivingDocument discussions could not be fetched. Server responsed with and error!');
            });
          });
        };
      }
    };
  });
