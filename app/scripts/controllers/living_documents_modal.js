'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:LivingDocumentsModalCtrl
 * @description
 * # LivingDocumentsModalCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('LivingDocumentsModalCtrl', function ($scope, $modalInstance, documents) {
    documents.$promise.then(function () {
      $scope.documentsLoaded = true;
    });
    $scope.documents = documents;

    $scope.connectToDocument = function () {
      if ( $scope.selectedDocument ) {
        // XXX Need to really make a connection
        $modalInstance.close($scope.selectedDocument);
      }
    };
  });
