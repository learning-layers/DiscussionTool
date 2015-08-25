'use strict';

describe('Service: config', function () {

  // load the service's module
  beforeEach(module('discussionToolApp'));

  // instantiate service
  var config;
  beforeEach(inject(function (_config_) {
    config = _config_;
  }));

  it('should exist', function () {
    expect(!!config).toBe(true);
  });

  it('should have configurations', function() {
    expect(!!config.sssRestUrl).toBe(true);
    expect(!!config.ldRestUrl).toBe(true);
    expect(!!config.bnpUrl).toBe(true);
  });

});
