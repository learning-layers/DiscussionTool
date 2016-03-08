'use strict';

/**
 * @ngdoc service
 * @name discussionToolApp.tags
 * @description
 * # tags
 * Factory in the discussionToolApp.
 */
angular.module('discussionToolApp')
  .factory('tagsService', function ($resource, $http, config, sssRestPrefix) {
    var fontMin = 15;
    var fontMax = 20;
    var tagsUrl = config.sssRestUrl + sssRestPrefix + '/tags/';
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
      removeFromEntity: function(params, data, successCallback, errorCallback) {
        return $http.delete(tagsUrl + 'entities/' + encodeURIComponent(params.entity), {
          data: JSON.stringify(data),
          headers: {
            'content-type': 'application/json;charset=UTF-8'
          },
          transformResponse: [angular.fromJson, function(data, headersGetter, status) {
            return ( status === 500 ) ? data : { worked: data.worked };
          }]
        }).then(successCallback, errorCallback);
      },
      calculateFontSize: function (likelihood) {
        // XXX Need to make sure that calculation is correct
        var fontSize = fontMax * likelihood;
        return ( fontSize < fontMin ) ? fontSize + fontMin : fontSize;
      }
    };
  });
