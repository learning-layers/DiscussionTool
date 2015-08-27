'use strict';

/**
 * @ngdoc service
 * @name discussionToolApp.discussions
 * @description
 * # discussions
 * Factory in the discussionToolApp.
 */
angular.module('discussionToolApp')
  .factory('discussionsService', function ($resource, $http, config) {

    var discsUrl = config.sssRestUrl + 'discs/discs/';
    var resourceInstance = $resource(discsUrl, {}, {
      query: {
        method: 'GET',
        isArray: true,
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : data.discs;
        }]
      },
      queryFilteredByTarget: {
        url: discsUrl + 'filtered/targets/:target',
        method: 'POST',
        isArray: true,
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : data.discs;
        }]
      },
      save: {
        method: 'POST',
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : { disc: data.disc };
        }]
      }
    });

    // Public API here
    return {
      queryFilteredByTarget: resourceInstance.queryFilteredByTarget,
      save: resourceInstance.save
    };
  });
