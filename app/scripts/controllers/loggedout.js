'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:LoggedoutCtrl
 * @description
 * # LoggedoutCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('LoggedoutCtrl', function ($scope, $location, $routeParams) {
    var searchObject = $location.search();
    var targetUri = ($routeParams.target) ? decodeURIComponent($routeParams.target) : undefined;

    $scope.logoutType = (searchObject.type) ? searchObject.type : undefined;

    $scope.restartAuthentication = function() {
      if ( !$scope.canRestartAuthentication ) {
        return;
      }

      $location.search('type', null);
      $location.path('auth/' + encodeURIComponent(targetUri));
    };

    $scope.canRestartAuthentication = function() {
      return !!targetUri;
    };
  });
