'use strict';

describe('Service: discService', function () {

  // load the service's module
  beforeEach(module('discussionsApp'));

  // instantiate service
  var discService;
  beforeEach(inject(function (_discService_) {
    discService = _discService_;
  }));

  it('should do something', function () {
    expect(!!discService).toBe(true);
  });

});
