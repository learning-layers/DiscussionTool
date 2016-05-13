'use strict';

/**
 * @ngdoc service
 * @name discussionToolApp.auth
 * @description
 * # auth
 * Factory in the discussionToolApp.
 */
angular.module('discussionToolApp')
  .factory('authService', function ($rootScope, $cookies, $resource, $http, config, sssRestPrefix) {
    var authCookieName = config.authCookieName;
    var authInstance = $resource(config.sssRestUrl + sssRestPrefix + '/auth/', {}, {
      oidcQuery: {
        method: 'GET',
        isArray: false,
        transformResponse: [angular.fromJson, function(data) {
          return data;
        }]
      }
    });

    function setAuthHeader() {
      if ( getAuthKey() ) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + getAuthKey();
      }
    }

    function removeAuthheader() {
      if ( $http.defaults.headers.common.Authorization ) {
        delete $http.defaults.headers.common.Authorization;
      }
    }

    function getAuthCookie () {
      var cookie = $cookies.getObject(authCookieName);

      return cookie ? cookie : null;
    }

    function setAuthCookie (dataObject) {
      $cookies.putObject(authCookieName, dataObject);
      setAuthHeader();
      $rootScope.$broadcast('dtAuthCookieSet');
    }

    function removeAuthCookie () {
      $cookies.remove(authCookieName);
      removeAuthheader();
    }

    function hasAuthCookie () {
      return !!getAuthCookie();
    }

    function getAuthKey () {
      if ( hasAuthCookie() ) {
        var cookie = getAuthCookie();

        return cookie.authKey;
      }

      return null;
    }

    function getUserUri () {
      if ( hasAuthCookie() ) {
        var cookie = getAuthCookie();

        return cookie.userUri;
      }

      return null;
    }

    if ( hasAuthCookie() ) {
      setAuthHeader();
    }

    return {
      getAuthCookie: getAuthCookie,
      setAuthCookie: setAuthCookie,
      removeAuthCookie: removeAuthCookie,
      getAuthKey: getAuthKey,
      getUserUri: getUserUri,
      isLoggedIn: function () {
        if ( hasAuthCookie() ) {
          if ( getAuthKey() && getUserUri() ) {
            return true;
          }
        }

        return false;
      },
      oidcAuth: function (authHeader, successCb, errorCb) {
        $http.defaults.headers.common.Authorization = authHeader;
        return authInstance.oidcQuery(successCb, errorCb);
      },
      buildOIDCRedirectUrl: function(redirectUri) {
        return config.oidcAuthorizationUrl +
            '?response_type=' + encodeURIComponent('id_token token') +
            '&client_id=' + encodeURIComponent(config.oidcClientId) +
            '&scope=' + encodeURIComponent('openid email profile') +
            '&redirect_uri=' + encodeURIComponent(redirectUri + '?'); // XXX Please note the queryString being added
      }
    };
  });
