'use strict';

describe('Controller: DiscussionEditModalCtrl', function () {

  // load the controller's module
  beforeEach(module('discussionToolApp'));

  var DiscussionEditModalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DiscussionEditModalCtrl = $controller('DiscussionEditModalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DiscussionEditModalCtrl.awesomeThings.length).toBe(3);
  });
});
