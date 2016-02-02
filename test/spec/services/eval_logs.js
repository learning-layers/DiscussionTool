'use strict';

describe('Service: evalLogsService', function () {

  // load the service's module
  beforeEach(module('discussionToolApp'));

  // instantiate service
  var evalLogsService;
  beforeEach(inject(function (_evalLogsService_) {
    evalLogsService = _evalLogsService_;
  }));

  it('should do something', function () {
    expect(!!evalLogsService).toBe(true);
  });

  it('shoud expose log resource', function () {
    expect(!!evalLogsService.log).toBe(true);
  });

  it('shoud expose log types', function () {
    expect(!!evalLogsService.logTypes).toBe(true);
  });

});
