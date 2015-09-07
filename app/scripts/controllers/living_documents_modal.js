'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:LivingDocumentsModalCtrl
 * @description
 * # LivingDocumentsModalCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('LivingDocumentsModalCtrl', function ($scope, $modalInstance, documents, discussion, livingDocumentsService, entitiesService) {
    documents.$promise.then(function () {
      if ( documents.length === 0 ) {
        $scope.documentsLoaded = true;
        return;
      }

      entitiesService.queryFiltered({
        entities: $scope._(documents).map(function (entity) { return encodeURIComponent(entity.id); }).join(',')
      }, {
        setDiscs: true
      }, function (entities) {
        $scope.documents = entities;
        $scope.documentsLoaded = true;
      });
    });

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
        $scope.create_document_form.documentLabel.$dirty = true;
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
