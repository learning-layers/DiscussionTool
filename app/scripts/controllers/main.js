'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('MainCtrl', function ($scope, authService) {
    $scope.isLoggedIn = function () {
      return authService.isLoggedIn();
    };
  });
