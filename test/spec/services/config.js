'use strict';

describe('Service: config', function () {

  // load the service's module
  beforeEach(module('discussionsApp'));

  // instantiate service
  var config;
  beforeEach(inject(function (_config_) {
    config = _config_;
  }));

  it('should do something', function () {
    expect(!!config).toBe(true);
  });

  it('should have configurations', function() {
    expect(!!config.restUrl).toBe(true);
    expect(!!config.bnpUrl).toBe(true);
    expect(!!config.ldUrl).toBe(true);
  });

});
