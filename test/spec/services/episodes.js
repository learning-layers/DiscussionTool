'use strict';

describe('Service: episodes', function () {

  // load the service's module
  beforeEach(module('discussionToolApp'));

  // instantiate service
  var episodes;
  beforeEach(inject(function (_episodes_) {
    episodes = _episodes_;
  }));

  it('should do something', function () {
    expect(!!episodes).toBe(true);
  });

});
