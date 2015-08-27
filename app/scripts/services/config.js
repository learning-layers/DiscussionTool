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
    sssRestUrl: 'http://localhost:8080/sss.adapter.rest.v2/',
    ldRestUrl: 'http://localhost:8080/living.documents/',
    bnpUrl: 'http://localhost:8080/BitsAndPieces'
  });
