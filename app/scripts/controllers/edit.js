'use strict';

/**
 * @ngdoc function
 * @name xcards4App.controller:EditCtrl
 * @description
 * # EditCtrl
 * Controller of the xcards4App
 */
angular.module('xcards4App')
  .controller('EditCtrl', function ($scope,Session) {
    $scope.frontImage=Session.card.cropped;
    $scope.side=true;
    $scope.toggle=function(){
    	$scope.side=!$scope.side;
    };
    $scope.message="You can edit here...";
    $scope.continue=function(){
    	console.log($scope.message);
    }
    $scope.tinymceOptions = {
    	menubar:false,
    	inline:true,
    	toolbar: "undo redo | bold italic | fontselect "
    };
  });
