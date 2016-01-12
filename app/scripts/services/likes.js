'use strict';

/**
 * @ngdoc service
 * @name discussionToolApp.likes
 * @description
 * # likes
 * Factory in the discussionToolApp.
 */
angular.module('discussionToolApp')
  .factory('likesService', function ($resource, config, sssRestPrefix) {
    var likesUrl = config.sssRestUrl + sssRestPrefix + '/likes/';
    var resourceInstance = $resource(likesUrl, {}, {
      add: {
        url: likesUrl + 'entities/:entity/value/:value',
        method: 'PUT',
        isArray: false,
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : {
            entity: data.entity
          };
        }]
      }
    });

    // Public API here
    return {
      add: resourceInstance.add
    };
  });
