'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:DiscussionsCtrl
 * @description
 * # DiscussionsCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('DiscussionsCtrl', function ($rootScope, $scope, $location, $routeParams, discussionsService, entitiesService, authService, config) {
    function constructFileDownloadUri (uri) {
      return config.sssRestUrl + 'files/files/download' +
      '?file=' + encodeURIComponent(uri) +
      '&key=' + encodeURIComponent(authService.getAuthKey());
    }

    var downloadLookupTable = {};

    var targetUri = decodeURIComponent($routeParams.target);

    $rootScope.targetEntityUri = targetUri;

    $scope.getDiscussionUrl = function (discussion) {
      return '#/discussions/' + encodeURIComponent(encodeURIComponent(targetUri)) + '/discussion/' + encodeURIComponent(encodeURIComponent(discussion.id));
    };

    $scope.attachedEntityClicked = function (entity, event) {
      angular.element(event.currentTarget).blur();

      if ( entity.type === 'placeholder') {
        return;
      } else if ( entity.type === 'evernoteResource' || entity.type === 'evernoteNote' ) {
        if ( downloadLookupTable[entity.id] ) {
          window.open(constructFileDownloadUri(downloadLookupTable[entity.id].file.id));
        }
        return;
      } else if ( entity.type === 'file' ) {
        window.open(constructFileDownloadUri(entity.id));
        return;
      }
      window.open(entity.id);
    };

    $scope.startNewDiscussion = function () {
      $location.path('discussions/' + encodeURIComponent(targetUri) + '/discussion/create');
    };

    // Loading and setting logical block
    if ( $scope.isLoggedIn() ) {
      entitiesService.queryFiltered({
        entities: encodeURIComponent(targetUri)
      },
      {}, function (entities) {
       if ( entities.length > 0 ) {
         $scope.targetEntity = entities[0];
       }
      });

      discussionsService.queryFilteredByTarget({
        target: encodeURIComponent(targetUri)
      },
      {
        setLikes: true,
        setTags: true,
        setAttachedEntities: true,
        setEntries: true
      }, function (discussions) {
        $scope.discussions = discussions;
        $scope.discussions.$promise.finally(function () {
          $scope.discussionsLoaded = true;
        });

        // Load up contained entitites
        var tmpAttachedUris = [];
        angular.forEach(discussions, function (discussion) {
          if ( discussion.attachedEntities ) {
            angular.forEach(discussion.attachedEntities, function (entity) {
              if ( entity.type === 'evernoteNote' || entity.type === 'evernoteResource' ) {
                if ( tmpAttachedUris.indexOf(entity.id) === -1 ) {
                  tmpAttachedUris.push(entity.id);
                }
              }
            });
          }
        });

        if ( tmpAttachedUris.length > 0 ) {
          entitiesService.queryFiltered({
            entities: $scope._(tmpAttachedUris).map(function (uri) { return encodeURIComponent(uri); }).join(',')
          },
          {

          }, function (entities) {
            angular.forEach(entities, function (entity) {
              downloadLookupTable[entity.id] = entity;
            });
          });
        }
      });
    }

  });
