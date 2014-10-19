'use strict';

describe('Controller: CropctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('xcards4App'));

  var CropctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CropctrlCtrl = $controller('CropctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
