'use strict';

/**
 * @ngdoc service
 * @name discussionToolApp.oidcHttpInterceptor
 * @description
 * # oidcHttpInterceptor
 * Factory in the discussionToolApp.
 */
angular.module('discussionToolApp')
  .factory('oidcHttpInterceptor', function ($rootScope, $q, $location, $cookies, config) {
    var oidcErrorStatusTexts = [
      'authCouldntConnectToOIDC',
      'authCouldntParseOIDCUserInfoResponse',
      'authOIDCUserInfoRequestFailed'
    ];

    // Public API here
    return {
      responseError: function (rejection) {
        if ( rejection.status === 500 && oidcErrorStatusTexts.indexOf(rejection.data.id) !== -1 ) {
          // Deal with case of authentication call itself failing, show message
          if ( rejection.config.url === config.sssRestUrl + 'auth/auth' || rejection.config.url === config.sssRestUrl + 'auth/auth/' ) {
            // Still remove the authetication cookie
            $cookies.remove(config.authCookieName);

            return $q.reject(rejection);
          }

          // Remove auth cookie and restart authentication
          $cookies.remove(config.authCookieName);
          $location.path('auth/' + encodeURIComponent($rootScope.targetEntityUri));
        }
        return $q.reject(rejection);
      }
    };
  });
