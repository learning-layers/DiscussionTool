'use strict';

/**
 * @ngdoc service
 * @name discussionToolApp.entities
 * @description
 * # entities
 * Factory in the discussionToolApp.
 */
angular.module('discussionToolApp')
  .factory('entitiesService', function ($resource, config) {
    var entitiesUrl = config.sssRestUrl + 'entities/entities/';
    var entitiesInstance = $resource(entitiesUrl, {}, {
      queryFiltered: {
        url: entitiesUrl + 'filtered/:entitites',
        method: 'POST',
        isArray: true,
        transformResponse: [angular.fromJson, function(data) {
          return data.entities;
        }]
      }
    });

    // Public API here
    return {
      queryFiltered: entitiesInstance.queryFiltered
    };
  });
