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
    // user: http://sss.eu/28664473108570073
    // token: 0ea4d8a998afbeada27caf9405eed6a5
    // XXX This should be set once by some AUTH service
    $http.defaults.headers.common.Authorization = 'Bearer ' + '0ea4d8a998afbeada27caf9405eed6a5';

    var discsUrl = config.sssRestUrl + 'discs/discs/';
    var resourceInstance = $resource(discsUrl + 'filtered', {}, {
      query: {
        method: 'GET',
        isArray: true,
        transformResponse: [angular.fromJson, function(data) {
          return data.discs;
        }]
      },
      queryByTarget: {
        url: discsUrl + 'targets/:target',
        method: 'GET',
        isArray: true,
        transformResponse: [angular.fromJson, function(data) {
          return data.discs;
        }]
      },
      save: {
        method: 'POST',
        transformResponse: [angular.fromJson, function(data) {
          return {
            disc: data.disc
          };
        }]
      }
    });

    // Public API here
    return {
      queryByTarget: resourceInstance.queryByTarget,
      save: resourceInstance.save
    };
  });
