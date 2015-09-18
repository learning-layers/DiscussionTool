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
      queryFiltered: {
        url: docsUrl + 'filtered',
        method: 'POST',
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
    var ldOidcUrl = config.ldRestUrl + 'api/users/oidc/';
    var ldResourceInstance = $resource(ldOidcUrl, {
      issuer: config.oidcAuthorizationUrl.replace('/authorize', '')
    }, {
      authenticate: {
        url: ldOidcUrl + 'authenticate',
        method: 'GET',
        withCredentials: true,
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 || status === 401 || status === 403 || status === 404 ) ? data : data;
        }]
      },
      createDocument: {
        url: ldOidcUrl + 'document',
        method: 'POST',
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 || status === 401 || status === 403 || status === 404 ) ? data : data;
        }]
      }
    });

    // Public API here
    return {
      query: resourceInstance.query,
      queryFiltered: resourceInstance.queryFiltered,
      get: resourceInstance.get,
      authenticate: ldResourceInstance.authenticate,
      createDocument: ldResourceInstance.createDocument,
      constructClientUrlFromUri: function (uri) {
        return config.ldClientUrl + '#/document/' + uri.split('document/')[1];
      },
      constructUriFromId: function (id) {
        return config.ldRestUrl + 'document/' + id;
      }
    };
  });
