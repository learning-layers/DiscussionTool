'use strict';

/**
 * @ngdoc service
 * @name discussionToolApp.episodes
 * @description
 * # episodes
 * Factory in the discussionToolApp.
 */
angular.module('discussionToolApp')
  .factory('episodesService', function ($resource, config) {
    var episodesUrl = config.sssRestUrl + 'learneps/learneps/';
    var episodesInstance = $resource(episodesUrl, {}, {
      queryVersions: {
        url: episodesUrl + ':episode/versions',
        method: 'GET',
        isArray: true,
        transformResponse: [angular.fromJson, function(data) {
          return data.learnEpVersions;
        }]
      }
    });

    // Public API here
    return {
      queryVersions: episodesInstance.queryVersions
    };
  });
