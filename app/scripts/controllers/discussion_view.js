'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:DiscussionViewCtrl
 * @description
 * # DiscussionViewCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('DiscussionViewCtrl', function ($rootScope, $scope, $routeParams, $q, discussionsService, livingDocumentsService, entitiesService, episodesService, tagsService, messagesService) {
    var targetUri = decodeURIComponent($routeParams.target);
    $scope.setTargetEntityUri(targetUri);

    var discussionUri = decodeURIComponent($routeParams.discussion);

    var isBeingSubmitted = false;

    function refetchDiscussionAndUpdateEntries () {
      discussionsService.queryFilteredDiscussion({
        disc: encodeURIComponent(discussionUri)
      },
      {
        setLikes: true,
        setEntries: true,
        setTags: true,
        setAttachedEntities: true,
        setReads: true
      }, function (discussion) {
        $scope.discussion.entries = discussion.entries;
        markDiscussionAsRead($scope.discussion);
      });
    }

    function handleEntryCreated (tagsAdded) {
      isBeingSubmitted = false;
      $scope.create_answer_form.description.$dirty = false;
      $scope.create_answer_form.$submitted = false;

      $scope.answer.description = '';
      $scope.answer.tags = [];
      $scope.answer.entities = [];

      messagesService.addSuccess('You have successfully created a new entry.');
      if ( tagsAdded !== true ) {
        messagesService.addWarning('At least one of the tags could not be added to the newly created entry.');
      }

      refetchDiscussionAndUpdateEntries();
    }

    function markDiscussionAsRead(discussion) {
      if ( discussion.entries.length > 0 ) {
        var groupedCounts = $scope._(discussion.entries).countBy(function (entry) {
          return entry.read ? 'read' : 'unread';
        });

        if ( groupedCounts.unread && groupedCounts.unread > 0 ) {
          discussionsService.update({
            disc: encodeURIComponent(discussion.id)
          },
          {
            read: true
          }, function() {
            // Do nothing
          }, function() {
            messagesService.addDanger('Discussion could not be set as read!');
          });
        }
      }
    }

    $scope.answer = {
      description: '',
      tags: [],
      entities: []
    };

    $scope.standaloneEntities = [];
    $scope.tagFrequencies = {};
    $scope.tagAutocomplete = $q.defer();

    $scope.isBeingSubmitted = function () {
      return isBeingSubmitted;
    };

    $scope.isEpisode = function () {
      return episodesService.isEpisode($scope.targetEntity);
    };

    $scope.doSubmit = function() {
      if ( !$scope.create_answer_form.$valid ) {
        $scope.create_answer_form.description.$dirty = true;
        return;
      }

      isBeingSubmitted = true;

      discussionsService.saveEntry({
        entry: $scope.answer.description,
        entities: $scope.answer.entities,
        disc: $scope.discussion.id,
        type: 'qaEntry',
        addNewDisc: false
      }, function(response) {
        var promises = [];
        angular.forEach($scope.answer.tags, function(tag) {
          var promise = tagsService.addToEntity({}, {
            label: tag.text,
            entity: response.entry,
            space: 'sharedSpace'
          }, function() {
          }).$promise;
          promises.push(promise);
        });
        // Navigate away when all promises resolve
        $q.all(promises).then(function () {
          handleEntryCreated(true);
        }, function () {
          handleEntryCreated(false);
        });
      }, function () {
        isBeingSubmitted = false;
        messagesService.addDanger('Entry could not be created. Server responded with an error!');
      });
    };

    // Loading and initializing
    discussionsService.queryFilteredDiscussion({
      disc: encodeURIComponent(discussionUri)
    },
    {
      setLikes: true,
      setEntries: true,
      setTags: true,
      setAttachedEntities: true,
      setReads: true
    }, function (discussion) {
      $scope.discussion = discussion;
      $scope.discussionLoaded = true;
      markDiscussionAsRead($scope.discussion);
    });

    entitiesService.queryFiltered({
      entities: encodeURIComponent(targetUri)
    },
    {}, function (entities) {
      if ( entities.length > 0 ) {
        $scope.targetEntity = entities[0];
      }

      if ( $scope.isEpisode() === false ) {
        return;
      }

      episodesService.queryVersionAndFillScope(targetUri, $scope);
    });
  });
