'use strict';

/**
 * @ngdoc service
 * @name discussionsApp.discService
 * @description
 * # discService
 * Factory in the discussionsApp.
 */
angular.module('discussionsApp')
  .factory('discService', function ($resource, $rootScope, config) {
    return $resource(config.restUrl + 'discs/discs', {}, {
      query: {
        method: 'GET',
        isArray: true,
        transformResponse: [angular.fromJson, function(data) {
          return data.discs;
        }]
      },
      save: {
        method: 'POST',
        transformResponse: [angular.fromJson, function(data) {
          return {
            disc: data.disc
          };
        }]
      }
    });
  });
