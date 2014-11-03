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
  .controller('PaymentModalCtrl', function ($scope,$modalInstance,Restangular) {
  	$scope.close=function(){
  		$modalInstance.close();
  	};
    $scope.handleStripe = function(status, response){
      if(response.error) {
        // there was an error. Fix it.
      } else {
        console.log(response);
        Restangular.all('orders').post({
          'token':response.id
        }).then(function(response){
          console.log(response);
        });
      }
    };
  });
