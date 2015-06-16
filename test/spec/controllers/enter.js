'use strict';

describe('Controller: EnterCtrl', function () {

  // load the controller's module
  beforeEach(module('discussionsApp'));

  var EnterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EnterCtrl = $controller('EnterCtrl', {
      $scope: scope
    });
  }));
});
