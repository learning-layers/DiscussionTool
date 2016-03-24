'use strict';

describe('Controller: LoggedoutCtrl', function () {

  // load the controller's module
  beforeEach(module('discussionToolApp'));

  var LoggedoutCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LoggedoutCtrl = $controller('LoggedoutCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
