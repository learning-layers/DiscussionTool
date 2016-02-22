'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('MainCtrl', function ($rootScope, $scope, $location, authService, episodesService, entitiesService, messagesService, evalLogsService, livingDocumentsService) {

    var loggingSetUp = false;
    var setupEvalLogs = function() {
      if ( loggingSetUp ) {
        return false;
      }
      // Send initial start event
      evalLogsService.log({}, {
        type: evalLogsService.logTypes.STARTDISCUSSIONTOOL
      });

      // Set working event interval
      setInterval(function() {
        evalLogsService.log({}, {
          type: evalLogsService.logTypes.WORKSINDISCUSSIONTOOL,
          entity: $rootScope.targetEntityUri
        });
      }, 30000);

      loggingSetUp = true;
    };

    $scope.isLoggedIn = function () {
      return authService.isLoggedIn();
    };

    $scope.setTargetEntityUri = function (uri) {
      // Only act if URI is not within the $rootScope yet
      if ( $rootScope.targetEntityUri !== uri ) {
        // Fill lookup table, used for evernoteResource files
        episodesService.queryVersions({
          episode: encodeURIComponent(uri)
        }, function (versions) {
          if ( versions && versions.length > 0 ) {
            entitiesService.fillLookupTable(versions[0]);
          } else {
            messagesService.addWarning('No episode versions loaded. Either target is not an Episode or there is some issue with the Serivice!');
          }
        }, function () {
          messagesService.addDanger('Episode versions could not be loaded. Service responded with an error!');
        });

        // Load entity and see if LD Document is already attached
        entitiesService.queryFiltered({
          entities: encodeURIComponent(uri)
        },
        {
          setAttachedEntities : true
        }, function (entities) {
         if ( entities.length > 0 ) {
           var entity = entities[0];
           if ( entity.attachedEntities.length > 0 ) {
             $rootScope.targetEntityLivingDocumentUri = entity.attachedEntities[0].id;
           } else {
             livingDocumentsService.createDocument({
               episodeId: entity.id // XXX This one is not yet available
             },
             {
               title: entity.label,
               description: entity.description
             }, function (data) {
               livingDocumentsService.get({
                 livingDoc: encodeURIComponent(livingDocumentsService.constructUriFromId(data.id))
               }, function(livingDoc) {
                 // XXX Probably need to make that call for both Episode and Document
                 entitiesService.entitiesAttach({
                   entity: encodeURIComponent(entity.id),
                   entities: encodeURIComponent(livingDoc.id)
                 }, {}, function() {
                   $rootScope.targetEntityLivingDocumentUri = livingDoc.id;
                 }, function() {
                   messagesService.addDanger('Newly created LivingDocument could not be attached to parent Entity!');
                 });
               }, function () {
                 messagesService.addDanger('Newly created LivingDocument could not be fetched from the server!');
               });
             }, function () {
               messagesService.addDanger('New LivingDocument could not be created. Server responded with an error!');
             });
           }
         }
        });
      }
      $rootScope.targetEntityUri = uri;
    };

    $scope.canStartDiscussion = function() {
      return false;
    };

    $scope.startNewDiscussion = function () {
      if ( $scope.canStartDiscussion() ) {
        $location.path('discussions/' + encodeURIComponent($rootScope.targetEntityUri) + '/discussion/create');
      } else {
        messagesService.addDanger('It is impossible to start a new discussion right now.');
        return;
      }
    };

    // Deal with logging
    // If unanthenticated, then wait until the AUTH event is sent
    if ( $scope.isLoggedIn() ) {
      setupEvalLogs();
    } else {
      $rootScope.$on('dtAuthCookieSet', function() {
        setupEvalLogs();
      });
    }
  });
