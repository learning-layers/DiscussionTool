'use strict';

/**
 * @ngdoc service
 * @name discussionToolApp.oidcHttpInterceptor
 * @description
 * # oidcHttpInterceptor
 * Factory in the discussionToolApp.
 */
angular.module('discussionToolApp')
  .factory('oidcHttpInterceptor', function ($q, $location, $cookies, config) {
    var oidcErrorStatusTexts = [
      'authCouldntConnectToOIDC',
      'authCouldntParseOIDCUserInfoResponse',
      'authOIDCUserInfoRequestFailed'
    ];

    // Public API here
    return {
      responseError: function (rejection) {
        if ( rejection.status === 500 && oidcErrorStatusTexts.indexOf(rejection.statusText) !== -1 ) {
          // Remove auth cookie and restart authentication
          $cookies.remove(config.athCookieName);
          $location.path('auth');
        }
        return $q.reject(rejection);
      }
    };
  });
