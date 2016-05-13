'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('MainCtrl', function ($rootScope, $scope, $location, $filter, authService, episodesService, entitiesService, messagesService, evalLogsService, livingDocumentsService) {

    $scope.targetEntityLabel = '';
    $scope.targetEntityLivingDocumentLabel = '';
    $scope.targetEntityLivingDocumentDescription = '';

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
            messagesService.addWarning('No episode versions loaded. Either target is not an Episode or there is some issue with the Service!');
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
           var attachedLivingDocument = entitiesService.getAttachedLivingDocument(entity);
           $scope.targetEntityLabel = entity.label;
           $scope.targetEntityAuthorLabel = entity.author.label;

           if ( entity.users && entity.users.length > 0 ) {
             var contributorLabels = [];
             angular.forEach(entity.users, function(single) {
               if ( single.label !== entity.author.label ) {
                 contributorLabels.push(single.label);
               }
             });
             $scope.targetEnityContributorLabels = contributorLabels;
           }

           if ( attachedLivingDocument ) {
             // Set attached Document ID to rootScope and data to local scope
             $rootScope.targetEntityLivingDocumentUri = attachedLivingDocument.id;
             $scope.targetEntityLivingDocumentLabel = attachedLivingDocument.label;
             $scope.targetEntityLivingDocumentDescription = attachedLivingDocument.description;
           } else {
             // Create Document in LD, provide Episode ID
             livingDocumentsService.createDocument({
               episodeId: entity.id
             },
             {
               title: entity.label,
               description: entity.description
             }, function (data) {
               // Load Document object from the SSS Service, additional check
               livingDocumentsService.get({
                 livingDoc: encodeURIComponent(livingDocumentsService.constructUriFromId(data.id))
               }, function(livingDoc) {
                 // Create a two-way connection between Episode and Document
                 // This attaches entities to each other
                 entitiesService.entitiesAttach({
                   entity: encodeURIComponent(entity.id),
                   entities: encodeURIComponent(livingDoc.id)
                 }, {}, function() {
                   // Set created Document ID to rootScope and data to local scope
                   $rootScope.targetEntityLivingDocumentUri = livingDoc.id;
                   $scope.targetEntityLivingDocumentLabel = livingDoc.label;
                   $scope.targetEntityLivingDocumentDescription = livingDoc.description;
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
      if ( $rootScope.targetEntityLivingDocumentUri ) {
        return true;
      }

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

    $scope.getTargetEntityLivingDocumentLabel = function() {
      return $scope.targetEntityLivingDocumentLabel;
    };

    $scope.getTargetEntityLivingDocumentDescription = function() {
      return $scope.targetEntityLivingDocumentDescription;
    };

    $scope.getTargetEntityLabelMain = function() {
      return $scope.targetEntityLabel;
    };

    $scope.getTargetEntityAuthorLabel = function() {
      return $filter('userLabel')($scope.targetEntityAuthorLabel);
    };

    $scope.getTargetEntityContributorCount = function() {
      if ( $scope.targetEnityContributorLabels ) {
        return $scope.targetEnityContributorLabels.length;
      }

      return 0;
    };

    $scope.getTargetEntityContributorLabels = function() {
      if ( $scope.targetEnityContributorLabels ) {
        return $scope._($scope.targetEnityContributorLabels).map(function(label) {
          return $filter('userLabel')(label);
        }).join(', ');
      }

      return '';
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
