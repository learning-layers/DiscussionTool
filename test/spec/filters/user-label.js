'use strict';

describe('Filter: userLabel', function () {

  // load the filter's module
  beforeEach(module('discussionToolApp'));

  // initialize a new instance of the filter before each test
  var userLabel;
  beforeEach(inject(function ($filter) {
    userLabel = $filter('userLabel');
  }));

  it('should return the input split by @ if present', function () {
    var text = 'username@username.im';
    expect(userLabel(text)).toBe('username');
  });

});
