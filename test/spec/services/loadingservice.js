'use strict';

describe('Service: LoadingService', function () {

  // load the service's module
  beforeEach(module('xcards4App'));

  // instantiate service
  var LoadingService;
  beforeEach(inject(function (_LoadingService_) {
    LoadingService = _LoadingService_;
  }));

  it('should do something', function () {
    expect(!!LoadingService).toBe(true);
  });

});
