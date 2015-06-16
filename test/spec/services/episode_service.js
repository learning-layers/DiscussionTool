'use strict';

describe('Service: episodeService', function () {

  // load the service's module
  beforeEach(module('discussionsApp'));

  // instantiate service
  var episodeService;
  beforeEach(inject(function (_episodeService_) {
    episodeService = _episodeService_;
  }));

  it('should do something', function () {
    expect(!!episodeService).toBe(true);
  });

});
