'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('discussionsApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach an isLoggedIn to the scope', function () {
    expect(typeof scope.isLoggedIn).toBe('function');
  });

  it('should not be logged in', function() {
    expect(scope.isLoggedIn()).toBe(false);
  });
});
