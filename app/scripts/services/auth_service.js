'use strict';

/**
 * @ngdoc service
 * @name discussionsApp.authService
 * @description
 * # authService
 * Service in the discussionsApp.
 */
angular.module('discussionsApp')
  .service('authService', function ($http, $rootScope, $cookies) {

    var authCookieName = 'DiscussionsAuth';

    function getAuthCookie() {
      var cookie = $cookies.getObject(authCookieName);

      if (cookie) {
        return cookie;
      }

      return null;
    }

    function setAutheCookie(data) {
      $cookies.putObject(authCookieName, data);
    }


    function deleteAuthCookie() {
      $cookies.remove(authCookieName);
    }

    function isAuthCookie() {
      return !!getAuthCookie();
    }

    function isLoggedIn() {
      if ( getAuthKey() && getEntityId() ) {
        return true;
      }

      return false;
    }

    function getAuthKey() {
      if ( $rootScope.authKey ) {
        return $rootScope.authKey;
      }

      return null;
    }

    function getEntityId() {
      if ( $rootScope.entityId ) {
        return $rootScope.entityId;
      }

      return null;
    }

    function setAuthKey(authKey) {
      $rootScope.authKey = authKey;
      var tmp = {};
      if (isAuthCookie()) {
        tmp = getAuthCookie();
      }
      tmp.authKey = authKey;
      setAutheCookie(tmp);
    }

    function setEntityId(entityId) {
      $rootScope.entityId = entityId;
      var tmp = {};
      if (isAuthCookie()) {
        tmp = getAuthCookie();
      }
      tmp.entityId = entityId;
      setAutheCookie(tmp);
    }

    function logOut() {
      setAuthKey(null);
      setEntityId(null);
      deleteAuthCookie();
    }

    // Initialize cookie
    var authCookie = getAuthCookie();

    if (authCookie) {
      setAuthKey(authCookie.authKey);
      setEntityId(authCookie.entityId);
      $http.defaults.headers.common.Authorization = 'Bearer ' + getAuthKey();
    }

    return {
      isLoggedIn:   isLoggedIn,
      getAuthKey:   getAuthKey,
      getEntityId: getEntityId,
      setAuthKey:   setAuthKey,
      setEntityId: setEntityId,
      logOut:       logOut
    };
  });
