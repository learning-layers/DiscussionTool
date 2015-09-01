'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:DiscussionViewCtrl
 * @description
 * # DiscussionViewCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('DiscussionViewCtrl', function ($rootScope, $scope, $routeParams, $modal, discussionsService, livingDocumentsService) {
    var targetUri = decodeURIComponent($routeParams.target);
    $rootScope.targetEntityUri = targetUri;

    var discussionUri = decodeURIComponent($routeParams.discussion);

    $scope.hasLivingDocument = function () {
      return !!$scope.getLivingDocument();
    };

    $scope.getLivingDocument = function () {
      if ( !$scope.discussion ) {
        return null;
      }
      return $scope._($scope.discussion.targets).find(function (target) { return target.type === 'livingDoc'; });
    };

    $scope.openLivingDocumentsModal = function () {
      var modalInstance = $modal.open({
        templateUrl: 'views/living_documents_modal.html',
        controller: 'LivingDocumentsModalCtrl',
        size: 'lg',
        resolve: {
          documents: function () {
            return livingDocumentsService.query();
          }
        }
      });

      modalInstance.result.then(function (document) {
        // XXX Need to also handle errors
        // Probably display a message of something failing
        discussionsService.addTargets({
          discussion: encodeURIComponent($scope.discussion.id),
          targets: encodeURIComponent(document.id)
        }, {}, function () {
          $scope.discussion.targets.push(document);
        });
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

      /*livingDocumentsService.query({}, function (documents) {
        console.log(documents);
      });*/
    });
  });
