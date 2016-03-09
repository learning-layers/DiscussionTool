'use strict';

/**
 * @ngdoc service
 * @name discussionToolApp.episodes
 * @description
 * # episodes
 * Factory in the discussionToolApp.
 */
angular.module('discussionToolApp')
  .factory('episodesService', function ($resource, config, sssRestPrefix, recommendationsService, authService) {
    var episodesUrl = config.sssRestUrl + sssRestPrefix + '/learneps/';
    var episodesInstance = $resource(episodesUrl, {}, {
      queryVersions: {
        url: episodesUrl + ':episode/versions',
        method: 'GET',
        isArray: true,
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : data.learnEpVersions;
        }]
      }
    });

    // Public API here
    return {
      queryVersions: episodesInstance.queryVersions,
      queryVersionAndFillScope: function (episodeUri, scope, additionalData) {
        var that = this;

        that.queryVersions({
          episode: encodeURIComponent(episodeUri)
        }, function (versions) {
          if ( versions.length === 0) {
            return;
          }

          that.fillScopeFromVersion(versions[0], scope, additionalData);
        });
      },
      fillScopeFromVersion: function(version, scope, additionalData) {
        var that = this;

        scope.episodeVersion = version;

        angular.forEach(scope.episodeVersion.learnEpEntities, function (entity) {
          var contained = false;

          angular.forEach(scope.episodeVersion.learnEpCircles, function (circle) {
            if ( that.isInsideCircle(entity, circle) ) {
              contained = true;
            }
          });

          if ( !contained ) {
            scope.standaloneEntities.push(entity.id);
          }
        });

        this.fillScopeRecommendations(scope, additionalData);
      },
      fillScopeRecommendations: function(scope, additionalData) {
        // Deal with tag autocomplete and recommendations
        var postData = {
          maxTags: 10,
          forUser: authService.getUserUri(),
          includeOwn: false
        };

        var attachedEntities = [];

        switch (additionalData.type) {
          case 'discussionCreate':
            // Set entity to NULl in case of new discussion
            postData.entity = null;
            break;
          case 'discussionEdit':
            // Use attached Entities from Discussion and Entries
            // Fall back to Discussion ID if none exist
            if ( additionalData.discussion.attachedEntities && additionalData.discussion.attachedEntities.length > 0 ) {
              angular.forEach(additionalData.discussion.attachedEntities, function(entity) {
                if ( attachedEntities.indexOf(entity.id) === -1 ) {
                  attachedEntities.push(entity.id);
                }
              });
            }

            if ( additionalData.discussion.entries && additionalData.discussion.entries.length > 0 ) {
              angular.forEach(additionalData.discussion.entries, function(entry) {
                if ( entry.attachedEntities && entry.attachedEntities.length > 0 ) {
                  angular.forEach(entry.attachedEntities, function(entity) {
                    if ( attachedEntities.indexOf(entity.id) === -1 ) {
                      attachedEntities.push(entity.id);
                    }
                  });
                }
              });
            }

            if ( attachedEntities.length > 0 ) {
              postData.entities = attachedEntities;
            } else {
              postData.entity = additionalData.discussion.id;
            }
            break;
          case 'entryCreate':
            // Use attached Entities of Discussion
            // Fall back to Discussion ID
            if ( additionalData.discussion.attachedEntities && additionalData.discussion.attachedEntities.length > 0 ) {
              postData.entities = scope._(additionalData.discussion.attachedEntities).map(function(entry) {
                return entry.id;
              });
            } else {
              postData.entity = additionalData.discussion.id;
            }
            break;
          case 'entryEdit':
            // Use attached Entities from Discussion and Entry
            // Fall back to Entry ID
            if ( additionalData.discussion.attachedEntities && additionalData.discussion.attachedEntities.length > 0 ) {
              angular.forEach(additionalData.discussion.attachedEntities, function(entity) {
                if ( attachedEntities.indexOf(entity.id) === -1 ) {
                  attachedEntities.push(entity.id);
                }
              });
            }
            if ( additionalData.entry.attachedEntities && additionalData.entry.attachedEntities.length > 0 ) {
              angular.forEach(additionalData.entry.attachedEntities, function(entity) {
                if ( attachedEntities.indexOf(entity.id) === -1 ) {
                  attachedEntities.push(entity.id);
                }
              });
            }

            if ( attachedEntities.length > 0 ) {
              postData.entities = attachedEntities;
            } else {
              postData.entity = additionalData.entry.id;
            }
            break;
          default:
            postData.entity = null;
        }

        recommendationsService.filteredTags({},
          postData, function(tags) {
            if ( tags.length > 0 ) {
              scope.tagResommendations = tags;
              var tmpTagAutocomplete = scope._(tags).map(function(tag) {
                return tag.label;
              });
              scope.tagAutocomplete.resolve(tmpTagAutocomplete);
            } else {
              scope.tagAutocomplete.reject([]);
            }
        }, function() {
          scope.tagAutocomplete.reject([]);
        });
      },
      isEpisode: function (entity) {
        if ( !entity ) {
          return false;
        }

        return (entity.type === 'learnEp') ? true : false;
      },
      isInsideCircle: function (entity, circle) {
        var cx = circle.xC,
            cy = circle.yC,
            rx = circle.xR,
            ry = circle.yR,
            inside = Math.pow(((entity.x-cx)/rx),2) + Math.pow(((entity.y-cy)/ry),2);

        return (inside <= 1) ? true : false;
      }
    };
  });
