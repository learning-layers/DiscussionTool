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
    oidcAuthorizationUrl: 'https://api.learning-layers.eu/o/oauth2/authorize',
    oidcClientId: '03d7dd09-e99e-43ea-bd93-d06661426c95',
    sssRestUrl: 'http://test-ll.know-center.tugraz.at/layers.test/',
    ldRestUrl: 'http://178.62.62.23:9000/',
    ldClientUrl: 'http://178.62.119.75/',
    bnpUrl: 'http://localhost/BitsAndPieces/'
  });
