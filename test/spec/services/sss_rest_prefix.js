'use strict';

describe('Service: sssRestPrefix', function () {

  // load the service's module
  beforeEach(module('discussionToolApp'));

  // instantiate service
  var sssRestPrefix;
  beforeEach(inject(function (_sssRestPrefix_) {
    sssRestPrefix = _sssRestPrefix_;
  }));

  it('should do something', function () {
    expect(!!sssRestPrefix).toBe(true);
  });

});
