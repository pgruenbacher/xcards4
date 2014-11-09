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
.controller('PreviewCtrl',function($scope,card,pricings,Session,$sce,$state,$modal,CardService, CreditService, Restangular){
  $scope.card=card;
  var user=$scope.user=Session.user;
  $scope.side=true;
  $scope.loading=false;
  //Pass this function to the modal
  $scope.loadingFunc=function(bool){
    $scope.loading=bool;
  };
  var discount=$scope.discount=0;
  var number=$scope.number=card.recipients.length;
  for(var i; i<pricings.length;i++){
    if(number>=pricings[i].cards*card.cardSetting.credit_rate){
      discount=$scope.discount=pricings[i].discount;
    }
  }
  var creditRate=$scope.creditRate=card.cardSetting.credit_rate;
  var creditCost=$scope.totalCredits=number*creditRate;
  var totalCost=$scope.totalCost=number*card.cardSetting.dollar_rate;
  var finalCost=$scope.finalCost=totalCost-number*discount;
  $scope.affordable=Session.user.credits >= creditCost;
  $scope.toggle=function(){
    $scope.side=!$scope.side;
  };
  $scope.useCredits=function(){
    console.log('use credits');
    $scope.loading=true;
    CreditService.useCredits(card.id).then(function(response){
      $scope.loading=false;
      console.log(response);
      Session.destroyCard();
      $state.go('account.main');
    },function(){
      $scope.loading=false;
    });
  };
  $scope.openPayment=function(){
    if(user.roles[0].type==='guest'){
      $scope.showLoginModal('login');
    }else{
      var paymentModal=$modal.open({
        templateUrl:'views/partials/paymentModal.html',
        size:'sm',
        controller:'PaymentModalCtrl',
        resolve:{
          amount:function(){
            return finalCost;
          },
          item:function(){
            return card;
          },
          loadingFunc:function(){
            return $scope.loadingFunc;
          }
        }
      });
      paymentModal.result.then(function(){
        Session.destroyCard();
        $state.go('account.main');
      },function(){
        console.log('modal dismissed');
      });
    }
  };
});

