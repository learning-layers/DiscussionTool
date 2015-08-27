'use strict';

describe('Service: authService', function () {

  // load the service's module
  beforeEach(module('discussionToolApp'));

  // instantiate service
  var authService;
  beforeEach(inject(function (_authService_) {
    authService = _authService_;
  }));

  it('should do something', function () {
    expect(!!authService).toBe(true);
  });

  // XXX This one is missing the basic tests for the exposure of the API

});
