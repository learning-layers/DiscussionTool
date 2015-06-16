'use strict';

describe('Service: authService', function () {

  // load the service's module
  beforeEach(module('discussionsApp'));

  // instantiate service
  var authService,
      authKey = 'key',
      entityUri = 'uri';
  beforeEach(inject(function (_authService_) {
    authService = _authService_;
    // TODO Probably need a service for that
    // Also the name should be loaded from central location
    inject(function($cookies) {
      $cookies.remove('DiscussionsAuth');
    });
  }));

  it('should do something', function () {
    expect(!!authService).toBe(true);
  });

  it('should return a public API', function() {
    expect(typeof authService.isLoggedIn).toBe('function');
    expect(typeof authService.getAuthKey).toBe('function');
    expect(typeof authService.getEntityUri).toBe('function');
    expect(typeof authService.setAuthKey).toBe('function');
    expect(typeof authService.setEntityUri).toBe('function');
  });

  it('should set and get authKey', function() {
    expect(authService.getAuthKey()).toBe(null);
    authService.setAuthKey(authKey);
    expect(authService.getAuthKey()).toBe(authKey);
  });

  it('should set and get entityUri', function() {
    expect(authService.getEntityUri()).toBe(null);
    authService.setEntityUri(entityUri);
    expect(authService.getEntityUri()).toBe(entityUri);
  });

  it('should authenticate', function() {
    expect(authService.isLoggedIn()).toBe(false);
    authService.setAuthKey(authKey);
    authService.setEntityUri(entityUri);
  });

  // TODO Need to test how cookies work

});
