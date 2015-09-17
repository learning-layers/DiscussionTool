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
      fillScopeFromVersion: function(version, scope) {
        var that = this;
        
        scope.episodeVersion = version;

        var tmpTagAutoComplete = [];
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

          // Add unique tags to be pushed into autocomplete later
          if ( entity.entity && entity.entity.tags.length > 0 ) {
            angular.forEach(entity.entity.tags, function (tag) {
              if ( tmpTagAutoComplete.indexOf(tag.label) === -1 ) {
                tmpTagAutoComplete.push(tag.label);
              }
              if ( scope.tagFrequencies[tag.label] ) {
                scope.tagFrequencies[tag.label].frequ += 1;
              } else {
                scope.tagFrequencies[tag.label] = {
                  label: tag.label,
                  frequ: 1
                };
              }
            });
          }
        });
        // Set autocomplete
        if ( tmpTagAutoComplete.length > 0 ) {
          scope.tagAutocomplete.resolve(tmpTagAutoComplete);

          scope.maxFrequency = scope._(scope.tagFrequencies).max(function(frequency) {
            return frequency.frequ;
          }).frequ;
          scope.minFrequency = scope._(scope.tagFrequencies).min(function(frequency) {
            return frequency.frequ;
          }).frequ;
        } else {
          scope.tagAutocomplete.reject([]);
        }
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
