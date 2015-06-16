'use strict';

/**
 * @ngdoc function
 * @name discussionsApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the discussionsApp
 */
angular.module('discussionsApp')
  .controller('NavbarCtrl', function ($scope, $window, config, authService) {
    var openBlank = function(url) {
      $window.open(url, '_blank');
    };

    $scope.navigateToBitsAndPieces = function() {
      openBlank(config.bnpUrl);
    };

    $scope.navigateToLivingDocuments = function() {
      openBlank(config.ldUrl);
    };

    $scope.logOut = function() {
      authService.logOut();
    };
  });
