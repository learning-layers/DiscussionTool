'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('AuthCtrl', function ($scope, $location, $http, config) {
    $scope.authMessage = 'Autentication in progress, please wait!';

    if ( $scope.isLoggedIn() ) {
      if ( config.oidcAuthorizationUrl && config.oidcClientId ) {
        var queryObject = $location.search();

        if (  !queryObject.access_token ) {
          $scope.authMessage = 'Redrecting to OpenID Connect Service Provider!';
          var url = config.oidcAuthorizationUrl +
              '?response_type=' + encodeURIComponent('id_token token') +
              '&client_id=' + encodeURIComponent(config.oidcClientId) +
              '&scope=' + encodeURIComponent('openid email profile') +
              '&redirect_uri=' + encodeURIComponent($location.absUrl()+'?'); // XXX Please note the querystring beginning at the end

            window.location.href = url;
        } else {
          // TOOD Check with SSS if authentication is ok
          $scope.authMessage = 'Handling OpenID Connect authentication response!';
          $http.defaults.headers.common.Authorization = queryObject.token_type + ' ' + queryObject.access_token;
          $http.get(config.sssRestUrl + 'auth/auth/').then(function(response) {
            // XXX Need to set the cookie with user and key
            console.log('success', response);
          }, function(response) {
            $scope.authMessage = 'ERROR: ' + response.status + ' : ' + response.statusText;
            console.log('error', response);
          });
        }
      } else {
        $scope.authMessage = 'Authentication configuration missing!';
      }
    } else {
      $scope.authMessage = 'You already are authenticated, redirecting!';
      $location.path('/');
    }
  });
