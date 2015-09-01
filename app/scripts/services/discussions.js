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

    var discsUrl = config.sssRestUrl + 'discs/discs/';
    var resourceInstance = $resource(discsUrl, {}, {
      queryFilteredDiscussion: {
        url: discsUrl + 'filtered/:disc',
        method: 'POST',
        isArray: false,
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : data.disc;
        }]
      },
      queryFilteredByTarget: {
        url: discsUrl + 'filtered/targets/:target',
        method: 'POST',
        isArray: true,
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : data.discs;
        }]
      },
      save: {
        method: 'POST',
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : { disc: data.disc };
        }]
      },
      saveEntry: {
        method: 'POST',
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : { entry: data.entry };
        }]
      },
      addTargets: {
        url: discsUrl + ':discussion/targets/:targets',
        method: 'PUT',
        transformResponse: [angular.fromJson, function (data, headersGetter, status) {
          return ( status === 500 ) ? data : { disc: data.disc };
        }]
      }
    });

    // Public API here
    return {
      queryFilteredDiscussion: resourceInstance.queryFilteredDiscussion,
      queryFilteredByTarget: resourceInstance.queryFilteredByTarget,
      save: resourceInstance.save,
      saveEntry: resourceInstance.saveEntry,
      addTargets: resourceInstance.addTargets
    };
  });
