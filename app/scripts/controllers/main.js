'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('MainCtrl', function ($rootScope, $scope, authService, episodesService, entitiesService, messagesService) {
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
          if ( versions && versions.length > 0 ) {
            entitiesService.fillLookupTable(versions[0]);
          } else {
            messagesService.addWarning('No episode versions loaded. Either target is not an Episode or there is some issue with the Serivice!');
          }
        }, function () {
          messagesService.addDanger('Episode versions could not be loaded. Service responded with an error!');
        });
      }
      $rootScope.targetEntityUri = uri;
    };
  });
