'use strict';

/**
 * @ngdoc service
 * @name discussionsApp.tagService
 * @description
 * # tagService
 * Factory in the discussionsApp.
 */
angular.module('discussionsApp')
  .factory('tagService', function ($resource, config) {
    return $resource(config.restUrl + 'tags/tags', {}, {
      query: {
        method: 'GET',
        isArray: true,
        transformResponse: [angular.fromJson, function(data) {
          return data.tags;
        }]
      },
      queryAssignments: {
        method: 'POST',
        isArray: true,
        transformResponse: [angular.fromJson, function(data) {
          return data.tags;
        }]
      },
      queryFrequencies: {
        url: config.restUrl + 'tags/tags/frequs',
        method: 'GET',
        isArray: true,
        transformResponse: [angular.fromJson, function(data) {
          return data.tagFrequs;
        }]
      },
      addToEntity: {
        url: config.restUrl + 'tags/tags/:tag/entities/:id',
        method: 'POST',
        transformResponse: [angular.fromJson, function(data) {
          return {
            tag: data.tag
          };
        }]
      }
    });
  });
