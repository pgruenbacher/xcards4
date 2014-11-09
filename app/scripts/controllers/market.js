'use strict';
/*jshint unused:vars*/
/**
 * @ngdoc function
 * @name xcards4App.controller:MarketCtrl
 * @description
 * # MarketCtrl
 * Controller of the xcards4App
 */
angular.module('xcards4App')
  .controller('MarketCtrl', function ($scope,Restangular,$modal,Session) {
    $scope.loading=true;
  	Restangular.all('pricings').getList().then(function(r){
      $scope.loading=false;
      $scope.products=r;
    });
    $scope.parseInt=parseInt;
    $scope.loadingFunc=function(bool){
      $scope.loading=bool;
    };
    $scope.openPayment=function(product){
      if(Session.user.roles[0].type==='guest'){
        $scope.showLoginModal('login');
      }else{
        $modal.open({
          templateUrl:'views/partials/paymentModal.html',
          size:'sm',
          controller:'PaymentModalCtrl',
          resolve:{
            amount:function(){
              return product.price;
            },
            item:function(){
              return product;
            },
            loadingFunc:function(){
              return $scope.loadingFunc;
            }
          }
        });
      }
    };
  });