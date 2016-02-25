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
    oidcAuthorizationUrl: 'OIDC_AUTHORIZATION_URL',
    oidcClientId: 'OIDC_CLIENT_ID',
    sssRestUrl: 'SSS_REST_URL',
    ldDocumentBase: 'LD_DOCUMENT_BASE',
    ldRestUrl: 'LD_REST_URL',
    ldClientUrl: 'LD_CLIENT_URL',
    bnpUrl: 'BNP_URL'
  });
