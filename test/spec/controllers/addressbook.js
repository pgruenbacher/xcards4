'use strict';

describe('Controller: AddressbookCtrl', function () {

  // load the controller's module
  beforeEach(module('xcards4App'));

  var AddressbookCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddressbookCtrl = $controller('AddressbookCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
