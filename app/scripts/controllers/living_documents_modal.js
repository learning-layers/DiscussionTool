'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:LivingDocumentsModalCtrl
 * @description
 * # LivingDocumentsModalCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('LivingDocumentsModalCtrl', function ($scope, $modalInstance, documents, discussion, livingDocumentsService, entitiesService, messagesService) {
    documents.$promise.then(function () {
      $scope.documents = documents;
      $scope.documentsLoaded = true;
    });

    $scope.livingDocument = {
      label: '',
      description: ''
    };
    $scope.isBeingSubmitted = false;
    $scope.createFormShown = false;

    $scope.showHideCreateForm = function () {
      if ( $scope.createFormShown ) {
        $scope.createFormShown = false;
      } else {
        $scope.createFormShown = true;
      }
    };

    $scope.connectToDocument = function () {
      if ( $scope.selectedDocument ) {
        $modalInstance.close($scope.selectedDocument);
      }
    };

    $scope.createNewLivingDocument = function() {
      if ( !$scope.create_document_form.$valid ) {
        $scope.create_document_form.documentLabel.$dirty = true;
        $scope.create_document_form.documentDescription.$dirty = true;
        return;
      }

      $scope.isBeingSubmitted = true;

      livingDocumentsService.createDocument({
        discussionId: discussion.id
      },
      {
        title: $scope.livingDocument.label,
        description: $scope.livingDocument.description
      }, function (data) {
        livingDocumentsService.get({
          livingDoc: encodeURIComponent(livingDocumentsService.constructUriFromId(data.id))
        }, function(livingDoc) {
          $modalInstance.close(livingDoc);
        }, function () {
          messagesService.addDanger('Newly created LivingDocument could not be fetched from the server!');
          $modalInstance.close();
        });
      }, function () {
        messagesService.addDanger('New LivingDocument could not be created. Server responded with an error');
        $modalInstance.close();
      });
    };
  });
