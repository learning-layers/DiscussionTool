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
            // Clear the search part
            $location.search({});
            $location.path('/discussions/' + encodeURIComponent(targetUri) + '/list');
          }, function () {
            setAuthMessage('danger', 'Authentication with SSS failed.');
          });
        }
      } else {
        setAuthMessage('danger', 'Authentication configuration missing!');
      }
    } else {
      setAuthMessage('warning', 'You already are authenticated, redirecting!');
      $location.path('/discussions/' + encodeURIComponent(targetUri) + '/list');
    }
  });
