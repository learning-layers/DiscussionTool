'use strict';

/**
 * @ngdoc service
 * @name discussionToolApp.livingDocuments
 * @description
 * # livingDocuments
 * Factory in the discussionToolApp.
 */
angular.module('discussionToolApp')
  .factory('livingDocumentsService', function ($resource, config) {
    var docsUrl = config.sssRestUrl + 'livingdocs/livingdocs/';
    var docsInstance = $resource(docsUrl, {}, {
      query: {
        method: 'GET',
        isArray: true,
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : data.livingDocs;
        }]
      }
    });

    // Public API here
    return {
      query: docsInstance.query
    };
  });
