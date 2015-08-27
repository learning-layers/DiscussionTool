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

  it('should have authentication cookie name', function () {
    expect(!!config.authCookieName).toBe(true);
  });

  it('should have oidc authorization url', function () {
    expect(!!config.oidcAuthorizationUrl).toBe(true);
  });

  it('should have oidc client id', function () {
    expect(!!config.oidcClientId).toBe(true);
  });

  it('should have sss rest url', function () {
    expect(!!config.sssRestUrl).toBe(true);
  });

  it('should have living documents rest url', function () {
    expect(!!config.ldRestUrl).toBe(true);
  });

  it('should have bits and pieces url', function () {
    expect(!!config.bnpUrl).toBe(true);
  });
});
