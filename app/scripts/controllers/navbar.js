'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('NavbarCtrl', function ($rootScope, $scope, authService) {
    $scope.logOut = function () {
      authService.removeAuthCookie();
    };
    $scope.getTargetEntityUri = function () {
        return encodeURIComponent(encodeURIComponent($rootScope.targetEntityUri));
    };
  });
