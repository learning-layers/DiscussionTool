'use strict';

describe('Directive: editDiscussion', function () {

  // load the directive's module
  beforeEach(module('discussionToolApp'));

  /*
  var element,
    scope;
  */
 var scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  /*it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<edit-discussion></edit-discussion>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the editDiscussion directive');
  }));*/
});
