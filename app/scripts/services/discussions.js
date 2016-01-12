'use strict';

/**
 * @ngdoc service
 * @name discussionToolApp.discussions
 * @description
 * # discussions
 * Factory in the discussionToolApp.
 */
angular.module('discussionToolApp')
  .factory('discussionsService', function ($resource, $http, $rootScope, config, sssRestPrefix) {

    var discsUrl = config.sssRestUrl + sssRestPrefix + '/discs/';
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
      update: {
        url: discsUrl + ':disc',
        method: 'PUT',
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : { disc: data.disc };
        }]
      },
      updateEntry: {
        url: discsUrl + 'entries/:entry',
        method: 'PUT',
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : {
            disc: data.disc,
            entry: data.entry
          };
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
      update: resourceInstance.update,
      saveEntry: resourceInstance.saveEntry,
      updateEntry: resourceInstance.updateEntry,
      addTargets: resourceInstance.addTargets,
      getLivingDocument: function (discussion) {
        if ( !discussion ) {
          return null;
        }
        return $rootScope._(discussion.targets).find(function (target) { return target.type === 'livingDoc'; });
      }
    };
  });
