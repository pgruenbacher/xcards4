'use strict';
/*jshint unused:vars,camelcase:false*/
/**
 * @ngdoc function
 * @name xcards4App.controller:CropctrlCtrl
 * @description
 * # CropctrlCtrl
 * Controller of the xcards4App
 */
angular.module('xcards4App')
.controller('PreviewCtrl',function($scope,card,pricings,Session,$sce,$state,$modal,CardService, Restangular){
  $scope.card=card;
  $scope.user=Session.user;
  $scope.side=true;
  var discount=$scope.discount=0;
  var number=$scope.number=card.recipients.length;
  for(var i; i<pricings.length;i++){
    if(number>=pricings[i].cards*card.cardSetting.credit_rate){
      discount=$scope.discount=pricings[i].discount;
    }
  }
  var totalCost=$scope.totalCost=number*card.cardSetting.dollar_rate;
  var finalCost=$scope.finalCost=totalCost-number*discount;
  $scope.toggle=function(){
    $scope.side=!$scope.side;
  };
  $scope.openPayment=function(){
    $modal.open({
      templateUrl:'views/partials/paymentModal.html',
      size:'sm',
      controller:'PaymentModalCtrl'
    });
  };
});

