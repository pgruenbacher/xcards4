'use strict';

describe('Controller: CardCtrl', function () {

  // load the controller's module
  beforeEach(module('xcards4App'));

  var CardCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CardCtrl = $controller('CardCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
