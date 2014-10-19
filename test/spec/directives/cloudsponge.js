'use strict';

describe('Directive: cloudSponge', function () {

  // load the directive's module
  beforeEach(module('xcards4App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<cloud-sponge></cloud-sponge>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the cloudSponge directive');
  }));
});
