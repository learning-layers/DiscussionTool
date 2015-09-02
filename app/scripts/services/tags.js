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
    var fontMin = 15;
    var fontMax = 20;
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
      addToEntity: tagsInstance.addToEntity,
      calculateFontSize: function (frequ, minFrequency, maxFrequency) {
        return (frequ === minFrequency) ? fontMin : (frequ / maxFrequency) * (fontMax - fontMin) + fontMin;
      }
    };
  });
