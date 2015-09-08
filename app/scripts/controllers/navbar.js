'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('NavbarCtrl', function ($rootScope, $scope, $location, config, authService) {
    $scope.logOut = function () {
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
