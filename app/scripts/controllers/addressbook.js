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
.controller('AddressBookCtrl', function ($scope,AddressService,$modal,$window) {
  AddressService.all(function(value){
  	console.log('address controller',value);
    $scope.addresses=value;
  });
  $scope.openImport=function(mode){
    $modal.open({
      templateUrl:'views/partials/importModal.html',
      size:'sm',
      resolve:{
        mode:function(){
          return mode;
        }
      }
    });
  }
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
.controller('AddressModalCtrl',function($scope,$state,AddressService,$modalInstance,address,mode){
	$scope.title=mode;
	$scope.mode=mode;
	$scope.address=address;
	$scope.save=function(address){
    address.number=address.number.replace(/\D/g,'');
		AddressService.put(address).then(function(response){
			$state.go($state.current,{}, {reload: true, inherit: false});
			$modalInstance.close();
		});
	};
	$scope.create=function(address){
    address.number=address.number.replace(/\D/g,'');
    console.log($scope.address.number);
		AddressService.create(address).then(function(response){
			$state.go($state.current,{},{reload: true, inherit: false});
			$modalInstance.close();
		});
	};
});
