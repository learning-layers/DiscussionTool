'use strict';

/**
 * @ngdoc service
 * @name discussionToolApp.config
 * @description
 * # config
 * Constant in the discussionToolApp.
 */
angular.module('discussionToolApp')
  .constant('config', {
    authCookieName: 'DiscussionToolAuth',
    oidcAuthorizationUrl: '',
    oidcClientId: '',
    sssRestUrl: '',
    ldRestUrl: '',
    ldClientUrl: '',
    bnpUrl: ''
  });
