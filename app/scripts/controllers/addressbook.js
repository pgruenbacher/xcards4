'use strict';
/*jshint unused:vars*/
/**
 * @ngdoc function
 * @name xcards4App.controller:AddressbookCtrl
 * @description
 * # AddressbookCtrl
 * Controller of the xcards4App
 */
angular.module('xcards4App')
.controller('AddressBookCtrl', function ($scope,AddressService,$state,$modal,$window) {
  $scope.saving=false;
  $scope.loading=false;
  $scope.creating=false;
  AddressService.all(function(value){
    $scope.addresses=value;
  });
  $scope.openImport=function(mode){
    $modal.open({
      templateUrl:'views/partials/importModal.html',
      windowClass: 'expanded-width',
      resolve:{
        mode:function(){
          return mode;
        }
      }
    });
  };
  $scope.removeAddress=function(id){
    $scope.loading=true;
    AddressService.remove(id).then(function(response){
      $state.go($state.current,{},{reload: true, inherit: false});
      $scope.loading=false;
    },function(){
      $scope.loading=false;
    });
  };
  $scope.openModal=function(mode,id){
  	console.log(mode);
  	$modal.open({
  		templateUrl:'views/partials/addressModal.html',
  		controller:'AddressModalCtrl',
  		size:'sm',
  		resolve:{
  			mode:function(){
  				return mode;
  			},
  			address:function(){
  				if(mode==='edit'){
  					return AddressService.copy(id); //existing address
  				}else{
  					return {}; //create form
  				}
  			}
  		}
  	});
  	// addressModal.result.then(function(){
  	// 	console.log('response');
  	// 	jQuery.LiveAdress.deactivate();
  	// 	angular.element($window).resize();
  	// },function(){
  	// 	jQuery.LiveAddress({}).deactivate();
  	// 	angular.element($window).resize();
  	// });
  };
})
.controller('AddressModalCtrl',function($scope,$q,$state,AddressService,$modalInstance,address,mode){
	$scope.title=mode;
	$scope.mode=mode;
	$scope.address=address;

  var validate=function(){
    var deferred=$q.defer();
    console.log($scope.validated);
    $scope.$on('event:address_valid',function(){
      console.log('resolve');
      deferred.resolve(true);
    });
    $scope.$on('event:address_invalid',function(){
      console.log('reject');
      deferred.reject();
    });
    $scope.$broadcast('event:form_submitted');
    return deferred.promise;
  };
	$scope.save=function(address){
    validate().then(function(){
      $scope.saving=true;
      address.number=address.number.replace(/\D/g,'');
      AddressService.put(address).then(function(response){
        $scope.saving=false;
        $state.go($state.current,{}, {reload: true, inherit: false});
        $modalInstance.close();
      });
    });
	};
	$scope.create=function(address){
    validate().then(function(){
      $scope.creating=true;
      if(typeof address.number !== 'undefined'){
        address.number=address.number.replace(/\D/g,'');
        console.log(address.number);
      }
      AddressService.create(address).then(function(response){
        $scope.creating=false;
        $state.go($state.current,{},{reload: true, inherit: false});
        $modalInstance.close();
      });
    });
	};
});
