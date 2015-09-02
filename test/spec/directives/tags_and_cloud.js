'use strict';

describe('Directive: tagsAndCloud', function () {

  // load the directive's module
  beforeEach(module('discussionToolApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tags-and-cloud></tags-and-cloud>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the tagsAndCloud directive');
  }));
});
