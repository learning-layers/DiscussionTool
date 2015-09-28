'use strict';

describe('Controller: EntryEditModalCtrl', function () {

  // load the controller's module
  beforeEach(module('discussionToolApp'));

  var EntryEditModalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EntryEditModalCtrl = $controller('EntryEditModalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
