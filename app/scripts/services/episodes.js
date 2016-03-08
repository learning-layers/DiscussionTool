'use strict';

/**
 * @ngdoc service
 * @name discussionToolApp.episodes
 * @description
 * # episodes
 * Factory in the discussionToolApp.
 */
angular.module('discussionToolApp')
  .factory('episodesService', function ($resource, config, sssRestPrefix, recommendationsService) {
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
      queryVersionAndFillScope: function (episodeUri, scope) {
        var that = this;

        that.queryVersions({
          episode: encodeURIComponent(episodeUri)
        }, function (versions) {
          if ( versions.length === 0) {
            return;
          }

          that.fillScopeFromVersion(versions[0], scope);
        });
      },
      fillScopeFromVersion: function(version, scope, type) {
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

        // Deal with tag autocomplete and recommendations
        var postData = {
          maxTags: 20
        };

        switch (type) {
          case 'discussionCreate':
            postData.entity = null;
            break;
          case 'discussionEdit':
            break;
          case 'entryCreate':
            break;
          case 'entryEdit':
            break;
          default:
            // XXX Not sure what to do
            // Probably set Entity to null
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
          // XXX Failed, maybe show some message
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
