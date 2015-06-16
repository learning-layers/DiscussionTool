'use strict';

describe('Controller: DiscussionCtrl', function () {

  // load the controller's module
  beforeEach(module('discussionsApp'));

  var DiscussionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DiscussionCtrl = $controller('DiscussionCtrl', {
      $scope: scope
    });
  }));

  it('should attach placeholders to the scope', function () {
    expect(scope.entity).toBe(null);
    expect(angular.isArray(scope.discs)).toBe(true);
  });

  it('should define startDiscussion and attach to the scope', function() {
    expect(typeof scope.startDiscussion).toBe('function');
  });
});
