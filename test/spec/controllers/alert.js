'use strict';

describe('Controller: AlertCtrl', function () {

  // load the controller's module
  beforeEach(module('discussionsApp'));

  var AlertCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AlertCtrl = $controller('AlertCtrl', {
      $scope: scope
    });
  }));
});
