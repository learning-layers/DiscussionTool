'use strict';

/**
 * @ngdoc service
 * @name discussionToolApp.entities
 * @description
 * # entities
 * Factory in the discussionToolApp.
 */
angular.module('discussionToolApp')
  .factory('entitiesService', function ($resource, $q, config, authService) {
    var downloadLookupTable = {};
    var entitiesUrl = config.sssRestUrl + 'entities/entities/';
    var entitiesInstance = $resource(entitiesUrl, {}, {
      queryFiltered: {
        url: entitiesUrl + 'filtered/:entities',
        method: 'POST',
        isArray: true,
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : data.entities;
        }]
      }
    });

    // Public API here
    return {
      queryFiltered: entitiesInstance.queryFiltered,
      fehchFromDownloadLookupTable: function (entityId) {
        if ( downloadLookupTable[entityId] ) {
          return downloadLookupTable[entityId];
        }

        return null;
      },
      queryAndAddToDownloadLookupTable: function (entityId) {
        var service = this;
        var deferred = $q.defer();

        service.queryFiltered({
          entities: encodeURIComponent(entityId)
        }, {}, function(entities) {
          if ( entities && entities.length > 0 ) {
            downloadLookupTable[entityId] = entities[0].file;
            deferred.resolve(service.fehchFromDownloadLookupTable(entityId));
          }
        }, function () {
          deferred.reject(null);
        });

        return deferred.promise;
      },
      constructFileDownloadUri: function (uri) {
        return config.sssRestUrl + 'files/files/download' +
        '?file=' + encodeURIComponent(uri) +
        '&key=' + encodeURIComponent(authService.getAuthKey());
      },
      isPlaceholder: function (entity) {
        return entity.type === 'placeholder';
      },
      attachedEntityClicked: function (entity, event) {
        var that = this;

        angular.element(event.currentTarget).blur();

        if ( entity.type === 'placeholder') {
          return;
        } else if ( entity.type === 'evernoteResource' || entity.type === 'evernoteNote' ) {
          var fileEntity = that.fehchFromDownloadLookupTable(entity.id);
          if ( fileEntity ) {
            window.open(that.constructFileDownloadUri(fileEntity.id));
          } else {
            var openedWindow = window.open();
            that.queryAndAddToDownloadLookupTable(entity.id)
              .then(function (fileEntity) {
                openedWindow.location.replace(that.constructFileDownloadUri(fileEntity.id));
              }, function() {
                openedWindow.close();
              });
          }
          return;
        } else if ( entity.type === 'file' ) {
          window.open(that.constructFileDownloadUri(entity.id));
          return;
        }
        window.open(entity.id);
      }
    };
  });
