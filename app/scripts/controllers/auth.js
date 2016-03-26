'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('AuthCtrl', function ($rootScope, $scope, $location, config, $routeParams, authService) {
    // Decode twice because it gets encoded once more by the OIDC
    var targetUri = decodeURIComponent(decodeURIComponent($routeParams.target));

    $scope.authMessageType = 'info';
    $scope.authMessage = 'Autentication in progress, please wait!';
    $scope.loadingComplete = true;

    function setAuthMessage (type, message) {
      $scope.authMessageType = type;
      $scope.authMessage = message;
    }

    if ( $scope.isLoggedIn() ) {
      authService.removeAuthCookie();
    }

    if ( config.oidcAuthorizationUrl && config.oidcClientId ) {
      var queryObject = $location.search();

      if (  !queryObject.access_token ) {
        $scope.loadingComplete = false;
        setAuthMessage('info', 'Redrecting to OpenID Connect Service Provider!');
        window.location.href = authService.buildOIDCRedirectUrl($location.absUrl());
      } else {
        $scope.loadingComplete = false;
        setAuthMessage('info', 'Handling OpenID Connect authentication response!');
        authService.oidcAuth(queryObject.token_type + ' ' + queryObject.access_token, function (response) {
          $scope.loadingComplete = true;
          setAuthMessage('success', 'Authentication successful, redirecting!');
          authService.setAuthCookie({
            authKey: response.key,
            userUri: response.user,
          });
          // Clear the search part
          $location.search({});
          $location.path('/discussions/' + encodeURIComponent(targetUri) + '/list');
        }, function () {
          $scope.loadingComplete = true;
          setAuthMessage('danger', 'Authentication with SSS failed.');
        });
      }
    } else {
      setAuthMessage('danger', 'Authentication configuration missing!');
    }

  });
