'use strict';

describe('Directive: ngThumb', function () {

  // load the directive's module
  beforeEach(module('xcards4App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ng-thumb></ng-thumb>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ngThumb directive');
  }));
});
