'use strict';

describe('Service: tagsService', function () {

  // load the service's module
  beforeEach(module('discussionToolApp'));

  // instantiate service
  var tagsService;
  beforeEach(inject(function (_tagsService_) {
    tagsService = _tagsService_;
  }));

  it('should do something', function () {
    expect(!!tagsService).toBe(true);
  });

  it('should expose add to entity resource', function () {
    expect(!!tagsService).toBe(true);
  });

});
