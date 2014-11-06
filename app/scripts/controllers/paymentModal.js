'use strict';
/*jshint unused:vars*/
/**
 * @ngdoc function
 * @name xcards4App.controller:PayMentModalCtrl
 * @description
 * # PayMentMOdalCtrl
 * Controller of the xcards4App
 */
angular.module('xcards4App')
.controller('PaymentModalCtrl', function ($scope,card,loadingFunc,$modalInstance,Restangular) {
	$scope.close=function(){
		$modalInstance.close();
	};
  $scope.loadingFunc=loadingFunc;
  $scope.handleStripe = function(status, response){
    $scope.loadingFunc(true);
    if(response.error) {
      $scope.loadingFunc(false);
      // there was an error. Fix it.
    } else {
      console.log(status,response);
      $scope.charge(response);
    }
  };
  $scope.charge=function(response){
    Restangular.all('orders').post({
      'token':response.id,
      'card': card.id
    }).then(function(response){
      $scope.loadingFunc(false);
      console.log(response);
      $modalInstance.close();
    },function(){
      $scope.loadingFunc(false);
    });
  };
});
