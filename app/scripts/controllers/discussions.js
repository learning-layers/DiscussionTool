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

    var targetUri = decodeURIComponent($routeParams.target);

    $rootScope.targetEntityUri = targetUri;

    $scope.attachedEntityClicked = function (entity, event) {
      angular.element(event.currentTarget).blur();

      if ( entity.type === 'placeholder') {
        return;
      } else if ( entity.type === 'evernoteResource' || entity.type === 'evernoteNote' ) {
        if ( entity.file ) {
          window.open(constructFileDownloadUri(entity.file.id));
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
        entitites: encodeURIComponent(targetUri)
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
      });
    }

  });
