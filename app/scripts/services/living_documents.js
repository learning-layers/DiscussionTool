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
    var resourceInstance = $resource(docsUrl, {}, {
      get: {
        url: docsUrl + ':livingDoc',
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : data.livingDoc;
        }]
      },
      query: {
        method: 'GET',
        isArray: true,
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : data.livingDocs;
        }]
      },
      save: {
        method: 'POST',
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : {
            livingDoc: data.livingDoc
          };
        }]
      }
    });

    // Public API here
    return {
      query: resourceInstance.query,
      save: resourceInstance.save,
      get: resourceInstance.get
    };
  });
