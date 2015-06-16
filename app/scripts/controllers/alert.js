'use strict';

/**
 * @ngdoc function
 * @name discussionsApp.controller:AlertCtrl
 * @description
 * # AlertCtrl
 * Controller of the discussionsApp
 */
angular.module('discussionsApp')
  .controller('AlertCtrl', function ($scope) {
    $scope.alerts = [];

    $scope.addAlert = function(type, msg) {
      var types = ['success', 'info', 'warning', 'danger'];

      if ( types.indexOf(type) === -1 ) {
        type = types[0];
      }

      $scope.alerts.push({
        type: type,
        msg: msg
      });
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.$on('dtAddAlert', function(event, data) {
      $scope.addAlert(data.type, data.msg);
    });

    $scope.$on('dtClearAlerts', function() {
      $scope.alerts = [];
    });
  });
