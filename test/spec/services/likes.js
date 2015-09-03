'use strict';

describe('Service: likesService', function () {

  // load the service's module
  beforeEach(module('discussionToolApp'));

  // instantiate service
  var likesService;
  beforeEach(inject(function (_likesService_) {
    likesService = _likesService_;
  }));

  it('should do something', function () {
    expect(!!likesService).toBe(true);
  });

});
