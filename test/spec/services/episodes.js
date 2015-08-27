'use strict';

describe('Service: episodesService', function () {

  // load the service's module
  beforeEach(module('discussionToolApp'));

  // instantiate service
  var episodesService;
  beforeEach(inject(function (_episodesService_) {
    episodesService = _episodesService_;
  }));

  it('should do something', function () {
    expect(!!episodesService).toBe(true);
  });

  it('shoud expose query versions resource', function () {
    expect(!!episodesService.queryVersions).toBe(true);
  });

});
