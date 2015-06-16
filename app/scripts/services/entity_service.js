'use strict';

/**
 * @ngdoc service
 * @name discussionsApp.entityService
 * @description
 * # entityService
 * Factory in the discussionsApp.
 */
angular.module('discussionsApp')
  .factory('entityService', function ($resource, config) {
    return $resource(config.restUrl + 'entities/entities/:id', {}, {
      get: {
        method: 'GET',
        transformResponse: [angular.fromJson, function(data) {
          return data.entity;
        }]
      }
    });
  });
