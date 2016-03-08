'use strict';

describe('Service: recommendations', function () {

  // load the service's module
  beforeEach(module('discussionToolApp'));

  // instantiate service
  var recommendationsService;
  beforeEach(inject(function (_recommendationsService_) {
    recommendationsService = _recommendationsService_;
  }));

  it('should do something', function () {
    expect(!!recommendationsService).toBe(true);
  });

});
