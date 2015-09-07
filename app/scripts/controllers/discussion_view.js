'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:DiscussionViewCtrl
 * @description
 * # DiscussionViewCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('DiscussionViewCtrl', function ($rootScope, $scope, $routeParams, $q, discussionsService, livingDocumentsService, entitiesService, episodesService, tagsService) {
    var targetUri = decodeURIComponent($routeParams.target);
    $rootScope.targetEntityUri = targetUri;

    var discussionUri = decodeURIComponent($routeParams.discussion);

    var isBeingSubmitted = false;


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
        $q.all(promises).then(function() {
          isBeingSubmitted = false;
          $scope.create_answer_form.description.$dirty = false;
          $scope.create_answer_form.$submitted = false;

          $scope.answer.description = '';
          $scope.answer.tags = [];
          $scope.answer.entities = [];

          // Fetch discussion and set entries
          discussionsService.queryFilteredDiscussion({
            disc: encodeURIComponent(discussionUri)
          },
          {
            setLikes: true,
            setEntries: true,
            setTags: true,
            setAttachedEntities: true
          }, function (discussion) {
            $scope.discussion.entries = discussion.entries;
          });
        });
      }, function() {
        isBeingSubmitted = false;
        // XXX Need to show some message to indicate that call failed
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
      setAttachedEntities: true
    }, function (discussion) {
      $scope.discussion = discussion;
      $scope.discussionLoaded = true;
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
