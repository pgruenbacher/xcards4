'use strict';

describe('Directive: AddressBook', function () {

  // load the directive's module
  beforeEach(module('xcards4App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<-address-book></-address-book>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the AddressBook directive');
  }));
});
