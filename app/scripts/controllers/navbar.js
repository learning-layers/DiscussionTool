'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('NavbarCtrl', function ($rootScope, $scope, $location, config, authService, livingDocumentsService, evalLogsService) {
    $scope.popoverTemplateUrl = 'views/templates/popover.html';
    $scope.targetEntityLabel = '';

    $scope.logOut = function () {
      // Trigger living documents logout with logout
      // Only trigger if user authenticated within the current
      // Usage session
      if ( livingDocumentsService.getAuthenticated() ) {
        livingDocumentsService.logOut();
      }

      evalLogsService.log({}, {
        type: evalLogsService.logTypes.CLOSEDISCUSSIONTOOL,
        entity: $rootScope.targetEntityUri
      }, function() {
        authService.removeAuthCookie();
        $location.search('type', 'loggedOut');
        $location.path('loggedout');
      }, function() {
        authService.removeAuthCookie();
        $location.search('type', 'loggedOut');
        $location.path('loggedout');      });
    };

    $scope.getTargetEntityUri = function () {
        return encodeURIComponent(encodeURIComponent($rootScope.targetEntityUri));
    };

    $scope.getTargetEntityLabel = function(maxlength) {
      var text = $scope.getTargetEntityLabelMain();
      if ( maxlength ) {
        if ( text.length > maxlength ) {
          return text.substring(0, maxlength-4) + '...';
        }
      }

      return text;
    };

    $scope.navigateToBnp = function () {
      window.open(config.bnpUrl);
      evalLogsService.log({}, {
        type: evalLogsService.logTypes.OPENBITSANDPIECES,
        entity: $rootScope.targetEntityUri
      });
    };

    $scope.openDocument = function () {
          var ldUri = $rootScope.targetEntityLivingDocumentUri;
          if ( ldUri ) {
            evalLogsService.log({}, {
              type: evalLogsService.logTypes.OPENLIVINGDOCUMENTS,
              entity: ldUri,
              entities: [$rootScope.targetEntityUri]
            });

            if ( livingDocumentsService.getAuthenticated() === true ) {
              window.open(livingDocumentsService.constructClientUrlFromUri(ldUri));
            } else {
              var openedWindow = window.open();

              livingDocumentsService.authenticate({
                forceUpdate: true
              }, function () {
                livingDocumentsService.setAuthenticated(true);
                openedWindow.location.replace(livingDocumentsService.constructClientUrlFromUri(ldUri));
              }, function() {
                openedWindow.close();
              });
            }
          }
        };
  });
