'use strict';

describe('Service: helperService', function () {

  // load the service's module
  beforeEach(module('xcards4App'));

  // instantiate service
  var helperService;
  beforeEach(inject(function (_helperService_) {
    helperService = _helperService_;
  }));

  it('should do something', function () {
    expect(!!helperService).toBe(true);
  });

});
