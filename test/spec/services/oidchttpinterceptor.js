'use strict';

describe('Service: oidcHttpInterceptor', function () {

  // load the service's module
  beforeEach(module('discussionToolApp'));

  // instantiate service
  var oidcHttpInterceptor;
  beforeEach(inject(function (_oidcHttpInterceptor_) {
    oidcHttpInterceptor = _oidcHttpInterceptor_;
  }));

  it('should do something', function () {
    expect(!!oidcHttpInterceptor).toBe(true);
  });

});
