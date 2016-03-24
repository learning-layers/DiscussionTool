'use strict';

/**
 * @ngdoc service
 * @name discussionToolApp.oidcHttpInterceptor
 * @description
 * # oidcHttpInterceptor
 * Factory in the discussionToolApp.
 */
angular.module('discussionToolApp')
  .factory('oidcHttpInterceptor', function ($rootScope, $q, $location, $cookies, config, sssRestPrefix) {
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
          if ( rejection.config.url === config.sssRestUrl + sssRestPrefix + '/auth' || rejection.config.url === config.sssRestUrl + sssRestPrefix + '/auth/' ) {
            // Still remove the authetication cookie
            $cookies.remove(config.authCookieName);

            return $q.reject(rejection);
          }

          // Remove cookie and send to loggedOut page
          $cookies.remove(config.authCookieName);
          $location.search('type', 'tokenError');
          $location.path('loggedout/' + encodeURIComponent($rootScope.targetEntityUri));
        }
        return $q.reject(rejection);
      }
    };
  });
