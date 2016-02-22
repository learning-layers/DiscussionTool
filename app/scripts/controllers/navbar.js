'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('NavbarCtrl', function ($rootScope, $scope, config, authService, livingDocumentsService, evalLogsService) {
    $scope.popoverTemplateUrl = 'views/templates/popover.html';

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
        window.close();
      }, function() {
        authService.removeAuthCookie();
        window.close();
      });
    };

    $scope.getTargetEntityUri = function () {
        return encodeURIComponent(encodeURIComponent($rootScope.targetEntityUri));
    };

    $scope.navigateToBnp = function () {
      window.open(config.bnpUrl);
      evalLogsService.log({}, {
        type: evalLogsService.logTypes.OPENBITSANDPIECES,
        entity: $rootScope.targetEntityUri
      });
    };
  });
