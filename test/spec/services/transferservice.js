'use strict';

describe('Service: transferservice', function () {

  // load the service's module
  beforeEach(module('xcards4App'));

  // instantiate service
  var transferservice;
  beforeEach(inject(function (_transferservice_) {
    transferservice = _transferservice_;
  }));

  it('should do something', function () {
    expect(!!transferservice).toBe(true);
  });

});
