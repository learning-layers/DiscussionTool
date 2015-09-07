'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:LivingDocumentsModalCtrl
 * @description
 * # LivingDocumentsModalCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('LivingDocumentsModalCtrl', function ($scope, $modalInstance, documents, discussion, livingDocumentsService) {
    documents.$promise.then(function () {
      $scope.documentsLoaded = true;
    });
    $scope.documents = documents;

    $scope.livingDocument = {
      label: '',
      description: ''
    };
    $scope.isBeingSubmitted = false;

    $scope.connectToDocument = function () {
      if ( $scope.selectedDocument ) {
        $modalInstance.close($scope.selectedDocument);
      }
    };

    $scope.createNewLivingDocument = function() {
      if ( !$scope.create_document_form.$valid ) {
        $scope.create_document_form.label.$dirty = true;
        $scope.create_document_form.documentDescription.$dirty = true;
        return;
      }

      $scope.isBeingSubmitted = true;

      livingDocumentsService.save({},
      {
        uri: 'http://living-docs.eu/document/' + (new Date()).getTime(),
        label: $scope.livingDocument.label,
        description: $scope.livingDocument.description,
        discussion: discussion.id
      }, function (data) {
        livingDocumentsService.get({
          livingDoc: encodeURIComponent(data.livingDoc)
        }, function(livingDoc) {
          $modalInstance.close(livingDoc);
        });
      });
    };
  });
