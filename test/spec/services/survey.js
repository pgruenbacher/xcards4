'use strict';

describe('Service: survey', function () {

  // load the service's module
  beforeEach(module('xcards4App'));

  // instantiate service
  var survey;
  beforeEach(inject(function (_survey_) {
    survey = _survey_;
  }));

  it('should do something', function () {
    expect(!!survey).toBe(true);
  });

});
