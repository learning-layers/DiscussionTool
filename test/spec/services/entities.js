'use strict';

describe('Service: entitiesService', function () {

  // load the service's module
  beforeEach(module('discussionToolApp'));

  // instantiate service
  var entitiesService;
  beforeEach(inject(function (_entitiesService_) {
    entitiesService = _entitiesService_;
  }));

  it('should do something', function () {
    expect(!!entitiesService).toBe(true);
  });

  it('should expose query filtered resource', function () {
    expect(!!entitiesService.queryFiltered).toBe(true);
  });

});
