'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('NavbarCtrl', function ($scope, authService) {
    $scope.logOut = function () {
      authService.removeAuthCookie();
    };
  });
