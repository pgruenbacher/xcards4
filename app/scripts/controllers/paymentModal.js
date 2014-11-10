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
.controller('PaymentModalCtrl', function ($scope,item,amount,Session,loadingFunc,$modalInstance,Restangular) {
  var card,product,charge;
  $scope.chargeProduct=function(response){
    Restangular.all('orders/products').post({
      'token':response.id,
      'product': product.id
    }).then(function(response){
      $scope.loadingFunc(false);
      console.log(response);
      $modalInstance.close();
    },function(){
      $scope.loadingFunc(false);
    });
  }
  $scope.chargeCard=function(response){
    Restangular.all('orders').post({
      'token':response.id,
      'card': card.id
    }).then(function(response){
      $scope.loadingFunc(false);
      console.log(response);
      Session.destroyCard();
      $modalInstance.close();
    },function(){
      $scope.loadingFunc(false);
    });
  };
  if(typeof item.originalImage !=='undefined'){
    card=item;
    charge=$scope.chargeCard;
  }else if(typeof item.price !=='undefined'){
    product=item;
    charge=$scope.chargeProduct;
  }
  $scope.amount=amount;
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
      charge(response);
    }
  };
});
