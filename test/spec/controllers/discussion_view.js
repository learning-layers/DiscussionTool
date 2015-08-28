'use strict';

describe('Controller: DiscussionViewCtrl', function () {

  // load the controller's module
  beforeEach(module('discussionToolApp'));

  var DiscussionViewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DiscussionViewCtrl = $controller('DiscussionViewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
