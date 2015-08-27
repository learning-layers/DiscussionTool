'use strict';

describe('Service: discussionsService', function () {

  // load the service's module
  beforeEach(module('discussionToolApp'));

  // instantiate service
  var discussionsService;
  beforeEach(inject(function (_discussionsService_) {
    discussionsService = _discussionsService_;
  }));

  it('should do something', function () {
    expect(!!discussionsService).toBe(true);
  });

  it('should expose query by target resource', function () {
    expect(!!discussionsService.queryByTarget).toBe(true);
  });

  it('should expose save resource', function () {
    expect(!!discussionsService.save).toBe(true);
  });

});
