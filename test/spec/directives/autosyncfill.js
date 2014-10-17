'use strict';

describe('Directive: autoSyncFill', function () {

  // load the directive's module
  beforeEach(module('xcards4App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<auto-sync-fill></auto-sync-fill>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the autoSyncFill directive');
  }));
});
