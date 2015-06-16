'use strict';

describe('Controller: NavbarCtrl', function () {

  // load the controller's module
  beforeEach(module('discussionsApp'));

  var NavbarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NavbarCtrl = $controller('NavbarCtrl', {
      $scope: scope
    });
  }));
  
  it('should define navigateToBitsAndPieces and attach to the scope', function() {
    expect(typeof scope.navigateToBitsAndPieces).toBe('function');
  });

  it('should define navigateToLivingDocuments and attach to the scope', function() {
    expect(typeof scope.navigateToLivingDocuments).toBe('function');
  });
});
