'use strict';

describe('Service: livingDocumentsService', function () {

  // load the service's module
  beforeEach(module('discussionToolApp'));

  // instantiate service
  var livingDocumentsService;
  beforeEach(inject(function (_livingDocumentsService_) {
    livingDocumentsService = _livingDocumentsService_;
  }));

  it('should do something', function () {
    expect(!!livingDocumentsService).toBe(true);
  });

  it('should expose query resource', function () {
    expect(!!livingDocumentsService.query).toBe(true);
  });

});
