'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('AuthCtrl', function ($scope, $location, config, authService) {
    $scope.authMessageType = 'info';
    $scope.authMessage = 'Autentication in progress, please wait!';

    function setAuthMessage (type, message) {
      $scope.authMessageType = type;
      $scope.authMessage = message;
    }

    if ( !$scope.isLoggedIn() ) {
      if ( config.oidcAuthorizationUrl && config.oidcClientId ) {
        var queryObject = $location.search();

        if (  !queryObject.access_token ) {
          setAuthMessage('info', 'Redrecting to OpenID Connect Service Provider!');
          window.location.href = authService.buildOIDCRedirectUrl($location.absUrl());
        } else {
          setAuthMessage('info', 'Handling OpenID Connect authentication response!');
          authService.oidcAuth(queryObject.token_type + ' ' + queryObject.access_token, function (response) {
            setAuthMessage('success', 'Authentication successful, redirecting!');
            authService.setAuthCookie({
              authKey: response.key,
              userUri: response.user,
            });
            $location.path('/');
          }, function () {
            setAuthMessage('danger', 'Authentication with SSS failed.');
          });
        }
      } else {
        setAuthMessage('danger', 'Authentication configuration missing!');
      }
    } else {
      setAuthMessage('warning', 'You already are authenticated, redirecting!');
      $location.path('/');
    }
  });
