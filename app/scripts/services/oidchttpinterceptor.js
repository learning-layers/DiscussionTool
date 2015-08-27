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
        console.log('ResE', rejection);
        if ( rejection.status === 500 && oidcErrorStatusTexts.indexOf(rejection.data.id) !== -1 ) {
          console.log($cookies, config, $location);
          // Remove auth cookie and restart authentication
          $cookies.remove(config.authCookieName);
          $location.path('auth/' + encodeURIComponent($rootScope.targetEntityUri));
        }
        return $q.reject(rejection);
      }
    };
  });
