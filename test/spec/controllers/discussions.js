'use strict';

describe('Controller: DiscussionsCtrl', function () {

  // load the controller's module
  beforeEach(module('discussionToolApp'));

  var DiscussionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DiscussionsCtrl = $controller('DiscussionsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DiscussionsCtrl.awesomeThings.length).toBe(3);
  });
});
