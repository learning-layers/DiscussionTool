'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('MainCtrl', function ($rootScope, $scope, $location, authService, episodesService, entitiesService, messagesService, evalLogsService) {

    var loggingSetUp = false;
    var setupEvalLogs = function() {
      if ( loggingSetUp ) {
        return false;
      }
      // Send initial start event
      evalLogsService.log({}, {
        type: evalLogsService.logTypes.STARTDISCUSSIONTOOL
      });

      // Set working event interval
      setInterval(function() {
        evalLogsService.log({}, {
          type: evalLogsService.logTypes.WORKSINDISCUSSIONTOOL,
          entity: $rootScope.targetEntityUri
        });
      }, 30000);

      loggingSetUp = true;
    };

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

    $scope.canStartDiscussion = function() {
      return false;
    };

    $scope.startNewDiscussion = function () {
      if ( $scope.canStartDiscussion() ) {
        $location.path('discussions/' + encodeURIComponent($rootScope.targetEntityUri) + '/discussion/create');
      } else {
        messagesService.addDanger('It is impossible to start a new discussion right now.');
        return;
      }
    };

    // Deal with logging
    // If unanthenticated, then wait until the AUTH event is sent
    if ( $scope.isLoggedIn() ) {
      setupEvalLogs();
    } else {
      $rootScope.$on('dtAuthCookieSet', function() {
        setupEvalLogs();
      });
    }
  });
