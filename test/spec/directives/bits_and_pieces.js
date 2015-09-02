'use strict';

describe('Directive: bitsAndPieces', function () {

  // load the directive's module
  beforeEach(module('discussionToolApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<bits-and-pieces></bits-and-pieces>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the bitsAndPieces directive');
  }));
});
