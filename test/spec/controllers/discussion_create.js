'use strict';

describe('Controller: DiscussionCreateCtrl', function () {

  // load the controller's module
  beforeEach(module('discussionToolApp'));

  var DiscussionCreateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DiscussionCreateCtrl = $controller('DiscussionCreateCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

});
