'use strict';

describe('Controller: CardsmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('xcards4App'));

  var CardsmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CardsmodalCtrl = $controller('CardsmodalCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
