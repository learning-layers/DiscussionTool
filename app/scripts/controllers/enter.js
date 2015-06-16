'use strict';

/**
 * @ngdoc function
 * @name discussionsApp.controller:EnterCtrl
 * @description
 * # EnterCtrl
 * Controller of the discussionsApp
 */
angular.module('discussionsApp')
  .controller('EnterCtrl', function ($scope, $route, $routeParams, $location, $rootScope, $http, authService) {
    authService.setAuthKey($routeParams.key);
    authService.setEntityId($routeParams.id);
    $http.defaults.headers.common.Authorization = 'Bearer ' + authService.getAuthKey();

    // TODO Needs some checks
    // Need to display an erro if nothing provided

    $location.path('/');
  });
