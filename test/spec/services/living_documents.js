'use strict';

describe('Service: livingDocuments', function () {

  // load the service's module
  beforeEach(module('discussionToolApp'));

  // instantiate service
  var livingDocuments;
  beforeEach(inject(function (_livingDocuments_) {
    livingDocuments = _livingDocuments_;
  }));

  it('should do something', function () {
    expect(!!livingDocuments).toBe(true);
  });

});
