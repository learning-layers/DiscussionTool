'use strict';

describe('Controller: LivingDocumentsModalCtrl', function () {

  // load the controller's module
  beforeEach(module('discussionToolApp'));

  var LivingDocumentsModalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LivingDocumentsModalCtrl = $controller('LivingDocumentsModalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
