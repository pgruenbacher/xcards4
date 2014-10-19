'use strict';

/**
 * @ngdoc function
 * @name xcards4App.controller:CropctrlCtrl
 * @description
 * # CropctrlCtrl
 * Controller of the xcards4App
 */
angular.module('xcards4App')
.controller('CropCtrl',function($scope){
	$scope.P={w:306,h:200};
	$scope.selected = function(c) {
    $scope.cropped=true;
    var rx = $scope.P.w / c.cords.w;
    var ry = $scope.P.h / c.cords.h;
    $('#preview').css({
      width: Math.round(rx * c.boundx) + 'px',
      height: Math.round(ry * c.boundy) + 'px',
      marginLeft: '-'+Math.round(rx * c.cords.x) + 'px',
      marginTop: '-'+Math.round(ry * c.cords.y) + 'px'
	  });
  };
});

