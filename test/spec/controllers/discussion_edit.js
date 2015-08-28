'use strict';

describe('Controller: DiscussionEditCtrl', function () {

  // load the controller's module
  beforeEach(module('discussionToolApp'));

  var DiscussionEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DiscussionEditCtrl = $controller('DiscussionEditCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
