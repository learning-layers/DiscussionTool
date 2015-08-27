'use strict';

/**
 * @ngdoc service
 * @name discussionToolApp.tags
 * @description
 * # tags
 * Factory in the discussionToolApp.
 */
angular.module('discussionToolApp')
  .factory('tagsService', function ($resource, config) {
    var tagsUrl = config.sssRestUrl + 'tags/tags/';
    var tagsInstance = $resource(tagsUrl, {}, {
      addToEntity: {
        method: 'POST',
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : { tag: data.tag };
        }]
      }
    });

    // Public API here
    return {
      addToEntity: tagsInstance.addToEntity
    };
  });
