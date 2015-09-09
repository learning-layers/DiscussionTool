'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('MainCtrl', function ($rootScope, $scope, authService, episodesService, entitiesService) {
    $scope.isLoggedIn = function () {
      return authService.isLoggedIn();
    };

    $scope.setTargetEntityUri = function (uri) {
      // Fill lookup table, used for evernoteResource files
      // Only fill if the URI is not within the $rootScope yet
      if ( $rootScope.targetEntityUri !== uri ) {
        episodesService.queryVersions({
          episode: encodeURIComponent(uri)
        }, function (versions) {
          entitiesService.fillLookupTable(versions[0]);
        });
      }
      $rootScope.targetEntityUri = uri;
    };
  });
