'use strict';

describe('Service: liveAddress', function () {

  // load the service's module
  beforeEach(module('xcards4App'));

  // instantiate service
  var liveAddress;
  beforeEach(inject(function (_liveAddress_) {
    liveAddress = _liveAddress_;
  }));

  it('should do something', function () {
    expect(!!liveAddress).toBe(true);
  });

});
