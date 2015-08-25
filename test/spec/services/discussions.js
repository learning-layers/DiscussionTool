'use strict';

describe('Service: discussions', function () {

  // load the service's module
  beforeEach(module('discussionToolApp'));

  // instantiate service
  var discussions;
  beforeEach(inject(function (_discussions_) {
    discussions = _discussions_;
  }));

  it('should do something', function () {
    expect(!!discussions).toBe(true);
  });

});
