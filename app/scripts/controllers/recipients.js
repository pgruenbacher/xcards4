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
.controller('RecipientsCtrl',function($scope,Session,$sce,$state,$modal,AddressService,CardService){
	$scope.selected=[];
  $scope.select=function(address){
    var existed=false;
    for (var i=0; i<$scope.selected.length; i++) {
      if ($scope.selected[i].id === address.id){
        $scope.selected.splice(i,1);
        existed=true;
      }
    }
    if(existed===false){
      $scope.selected.push(address);
    }
  };
  $scope.isSelected=function(id){
    for (var i=0; i<$scope.selected.length; i++) {
      if ($scope.selected[i].id === id){
          return true;
      }
    }
    return false;
  };
  $scope.continue=function(){
    if($scope.selected.length>0){
      var card=Session.card;
      var recipientIds=$scope.selected.map(function(n){
        return n.id;
      });
      CardService.createRecipients(card.id,recipientIds).then(function(response){
        console.log(response);
        card.recipients=response.recipients;
        Session.saveCard(card);
        $state.go('main.preview');
      });
    }
  };
});

