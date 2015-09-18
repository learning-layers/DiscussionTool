'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('NavbarCtrl', function ($rootScope, $scope, $location, config, authService, livingDocumentsService) {
    $scope.logOut = function () {
      // Trigger living documents logout with logout
      // Only trigger if user authenticated within the current
      // Usage session
      if ( livingDocumentsService.getAuthenticated() ) {
        livingDocumentsService.logOut();
      }

      authService.removeAuthCookie();
      window.close();
    };

    $scope.getTargetEntityUri = function () {
        return encodeURIComponent(encodeURIComponent($rootScope.targetEntityUri));
    };

    $scope.navigateToBnp = function () {
      window.open(config.bnpUrl);
    };

    $scope.startNewDiscussion = function () {
      $location.path('discussions/' + encodeURIComponent($rootScope.targetEntityUri) + '/discussion/create');
    };
  });
