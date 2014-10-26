'use strict';
/*jshint camelcase:false*/
/**
 * @ngdoc function
 * @name xcards4App.controller:CropctrlCtrl
 * @description
 * # CropctrlCtrl
 * Controller of the xcards4App
 */
angular.module('xcards4App')
.controller('CropCtrl',function($scope,Session,$sce,$state,$modal,CardService){
	$scope.P={w:306,h:200};
  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  };
  $scope.imageUrl=Session.card.original.url_path;
  console.log($scope.imageUrl);
  $scope.info={cords:{w:0,h:0}};
  $scope.checkHeight=function(){
    if($scope.info.cords.h>1000){
      return true;
    }else{
      return false;
    }
  };
  $scope.checkWidth=function(){
    if($scope.info.cords.w>1535){
      return true;
    }else{
      return false;
    }
  };
	$scope.selected = function(c) {
    if(typeof c !== 'undefined'){
      $scope.info=c;
      $scope.cropped=true;
      var rx = $scope.P.w / c.cords.w;
      var ry = $scope.P.h / c.cords.h;
      jQuery('#preview').css({
        width: Math.round(rx * c.boundx) + 'px',
        height: Math.round(ry * c.boundy) + 'px',
        marginLeft: '-'+Math.round(rx * c.cords.x) + 'px',
        marginTop: '-'+Math.round(ry * c.cords.y) + 'px'
      });
      $scope.$apply();
    }
  };
  $scope.continue=function(){
    if(!$scope.checkHeight() && !$scope.checkWidth()){
      var confirmModal=$modal.open({
        templateUrl: 'views/partials/cropConfirmModal.html',
        size: 'sm',
        controller:'cropConfirmController'
      });
      confirmModal.result.then(function(){
        $scope.submit();
      },function(){
        console.log('modal dismissed');
      });
    }else{
      $scope.submit();
    }
  };
  $scope.submit=function(){
    CardService.crop(Session.card.id,Session.card.original.id,$scope.info.cords).then(function(response){
      console.log(response);
      var card=Session.card;
      card.cropped=response.image;
      if(Session.saveCard(card)){
        $state.go('main.edit')
      }
    },function(error){
      console.log('could not connect error',error);
    });
  };
})
.controller('cropConfirmController',function($scope,$modalInstance){
  $scope.confirm=function(){
    $modalInstance.close();
  };
  $scope.cancel=function(){
    $modalInstance.dismiss();
  };
});

