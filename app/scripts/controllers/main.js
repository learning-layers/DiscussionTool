'use strict';

/**
 * @ngdoc function
 * @name discussionsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the discussionsApp
 */
angular.module('discussionsApp')
  .controller('MainCtrl', function ($scope, $rootScope, authService) {
    $scope.isLoggedIn = function() {
      return authService.isLoggedIn();
    };
  });
