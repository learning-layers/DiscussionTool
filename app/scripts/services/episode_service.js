'use strict';

/**
 * @ngdoc service
 * @name discussionsApp.episodeService
 * @description
 * # episodeService
 * Factory in the discussionsApp.
 */
angular.module('discussionsApp')
  .factory('episodeService', function ($resource, config, helpers) {

    return $resource(config.restUrlOld + 'learnEpVersionsGet', {}, {
      getVersion: {
        url: config.restUrlOld + 'learnEpVersionsGet',
        method: 'POST',
        transformRequest: [helpers.deprecatedRequestTransformation],
        transformResponse: [angular.fromJson, function(data) {
          return data.learnEpVersionsGet.learnEpVersions[0];
        }]
      }
    });
  });
