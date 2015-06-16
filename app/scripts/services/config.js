'use strict';

/**
 * @ngdoc service
 * @name discussionsApp.config
 * @description
 * # config
 * Constant in the discussionsApp.
 */
angular.module('discussionsApp')
  .constant('config', {
    restUrlOld: 'http://localhost:8080/ss-adapter-rest-v1/SSAdapterRest/',
    restUrl : 'http://localhost:8080/ss-adapter-rest-v2/',
    bnpUrl : 'http://localhost:8080/BitsAndPieces/',
    ldUrl : 'http://localhost:8080/ld/'
  });
