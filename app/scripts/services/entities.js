'use strict';

/**
 * @ngdoc service
 * @name discussionToolApp.entities
 * @description
 * # entities
 * Factory in the discussionToolApp.
 */
angular.module('discussionToolApp')
  .factory('entitiesService', function ($resource, $q, $rootScope, config, authService, sssRestPrefix) {
    var downloadLookupTable = {};
    var entitiesUrl = config.sssRestUrl + sssRestPrefix + '/entities/';
    var entitiesInstance = $resource(entitiesUrl, {}, {
      queryFiltered: {
        url: entitiesUrl + 'filtered/:entities',
        method: 'POST',
        isArray: true,
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : data.entities;
        }]
      },
      entitiesAttach: {
        url: entitiesUrl + ':entity/attach/entities/:entities',
        method: 'POST',
        isArray: false,
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : data.entity;
        }]
      }
    });

    function getIconTypeFromFile (fileEntity) {
      var mimeType = fileEntity.mimeType;
      var name = fileEntity.type;

      if ( mimeType ) {
        switch( mimeType ) {
          case 'application/pdf':
          name = 'filePdf';
          break;
          case 'image/png':
          case 'image/jpeg':
          case 'image/x-icon':
          case 'image/gif':
          case 'image/svg+xml':
          case 'image/bmp':
          case 'image/tiff':
          name = 'fileImage';
          break;
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          case 'application/msword':
          name = 'fileDoc';
          break;
          case 'application/vnd.ms-excel':
          case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
          name = 'fileSpreadsheet';
          break;
          case 'application/vnd.ms-powerpoint':
          case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
          name = 'filePresentation';
          break;
          case 'text/plain':
          case 'text/html':
          case 'text/css':
          case 'text/x-vcard':
          name = 'fileText';
          break;
          case 'application/ogg':
          case 'audio/mp3':
          case 'audio/midi':
          case 'audio/x-m4a':
          case 'audio/amr':
          case 'audio/mpeg':
          case 'audio/wav':
          name = 'fileAudio';
          break;
          case 'video/avi':
          case 'video/mp4':
          case 'video/mpeg':
          case 'video/quicktime':
          name = 'fileVideo';
          break;
        }
      } else {
        switch(fileEntity.id.substring(fileEntity.id.length-4).toLowerCase() ) {
          case '.pdf':
          name = 'filePdf';
          break;
          case '.png':
          case '.jpg':
          case 'jpeg':
          case '.ico':
          case '.gif':
          case '.svg':
          case '.bmp':
          case '.tif':
          case 'tiff':
          name = 'fileImage';
          break;
          case 'docx':
          case '.doc':
          name = 'fileDoc';
          break;
          case '.xls':
          case 'xlsx':
          name = 'fileSpreadsheet';
          break;
          case '.ppt':
          case 'pptx':
          name = 'filePresentation';
          break;
          case '.txt':
          case 'html':
          case '.xml':
          case '.css':
          case '.vcf':
          name = 'fileText';
          break;
          case '.mp3':
          case '.ogg':
          case '.wav':
          case 'midi':
          case '.wma':
          case '.m4a':
          case '.amr':
          name = 'fileAudio';
          break;
          case '.avi':
          case '.m4v':
          case 'mpeg':
          case '.mpg':
          case '.mov':
          case '.flv':
          case '.wmv':
          name = 'fileVideo';
          break;
        }
      }

      return name;
    }

    // Public API here
    return {
      queryFiltered: entitiesInstance.queryFiltered,
      entitiesAttach: entitiesInstance.entitiesAttach,
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
            if ( entities[0].file ) {
              downloadLookupTable[entityId] = entities[0].file;
              deferred.resolve(service.fehchFromDownloadLookupTable(entityId));
            } else {
              deferred.reject(null);
            }
          }
        }, function () {
          deferred.reject(null);
        });

        return deferred.promise;
      },
      fillLookupTable: function (version) {
        var uris = [];
        angular.forEach(version.learnEpEntities, function (entity) {
          if ( entity.entity.type === 'evernoteResource' && uris.indexOf(entity.entity.id) === -1 ) {
            uris.push(entity.entity.id);
          }
        });

        if ( uris.length === 0 ) {
          return;
        }

        this.queryFiltered({
          entities: $rootScope._(uris).map(function (uri) { return encodeURIComponent(uri); }).join(',')
        }, {}, function (entities) {
          angular.forEach(entities, function (entity) {
            if ( !downloadLookupTable[entity.id] ) {
              downloadLookupTable[entity.id] = entity.file;
            }
          });
        });
      },
      constructFileDownloadUri: function (uri) {
        return config.sssRestUrl + sssRestPrefix + '/files/download' +
        '?file=' + encodeURIComponent(uri) +
        '&key=' + encodeURIComponent(authService.getAuthKey());
      },
      isPlaceholder: function (entity) {
        return entity.type === 'placeholder';
      },
      isNotebook: function (entity) {
        return entity.type === 'evernoteNotebook';
      },
      attachedEntityClicked: function (entity, event) {
        var that = this;

        angular.element(event.currentTarget).blur();

        if ( entity.type === 'placeholder' || entity.type === 'evernoteNotebook' ) {
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
        } else if ( entity.type === 'uploadedFile' ) {
          window.open(that.constructFileDownloadUri(entity.id));
          return;
        }
        window.open(entity.id);
      },
      getIconLocation: function (entity) {
        var iconName = 'unknown';
        var namesIcons = {
          'unknown' : 'images/icons/unknown.png',
          'entity' : 'images/icons/entity.png',
          'placeholder' : 'images/icons/placeholder.png',
          'evernoteNotebook' : 'images/icons/evernoteNotebook.png',
          'evernoteNote' : 'images/icons/evernoteNote.png',
          'evernoteResource' : 'images/icons/evernoteResource.png',
          'uploadedFile' : 'images/icons/file.png',
          'filePdf' : 'images/icons/filePdf.png',
          'fileImage' : 'images/icons/image.png',
          'fileDoc' : 'images/icons/fileDoc.png',
          'fileSpreadsheet' : 'images/icons/spreadsheet.png',
          'filePresentation' : 'images/icons/presentation.png',
          'fileText' : 'images/icons/text.png',
          'fileAudio' : 'images/icons/audio.png',
          'fileVideo' : 'images/icons/video.png',
          'link' : 'images/icons/entity.png'
        };

        switch ( entity.type ) {
          case 'entity':
          case 'placeholder':
          case 'evernoteNotebook':
          case 'evernoteNote':
          case 'link':
            iconName = entity.type;
            break;
          case 'uploadedFile':
            iconName = getIconTypeFromFile(entity);
            break;
          case 'evernoteResource':
            if ( entity.file ) {
              iconName = getIconTypeFromFile(entity.file);
            } else if ( downloadLookupTable[entity.id] ) {
              iconName = getIconTypeFromFile(downloadLookupTable[entity.id]);
            } else {
              iconName = entity.type;
            }
            break;
        }

        return namesIcons[iconName];
      },
      getAttachedLivingDocument: function (entity) {
        if ( !entity ) {
          return null;
        }
        return $rootScope._(entity.attachedEntities).find(function (target) { return target.type === 'livingDoc'; });
      },
      fixNewlines: function(text) {
        if ( typeof text === 'string' ) {
          return text.replace(/\\n/g, '\n');
        }

        return text;
      },
      fixNewlinesAndConvertToBr: function(text, maxLength) {
        text = this.fixNewlines(text);
        if ( typeof text === 'string' ) {
          if ( typeof maxLength === 'number' && maxLength && text.length > maxLength ) {
            text = text.substring(0, maxLength-4) + '...';
          }
          return text.replace(/\n/g, '<br>');
        }

        return text;
      }
    };
  });
