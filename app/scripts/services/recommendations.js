'use strict';

/**
 * @ngdoc service
 * @name discussionToolApp.recommendations
 * @description
 * # recommendations
 * Factory in the discussionToolApp.
 */
angular.module('discussionToolApp')
  .factory('recommendationsService', function ($resource, $http, config, sssRestPrefix) {
    var recommUrl = config.sssRestUrl + sssRestPrefix + '/recomm/';
    var recommInstance = $resource(recommUrl, {}, {
      filteredTags: {
        method: 'POST',
        url: recommUrl + 'filtered/tags',
        isArray: true,
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : data.tags;
        }]
      }
    });
    return {
      filteredTags: recommInstance.filteredTags
    };
  });
