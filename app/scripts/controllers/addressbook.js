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
  $scope.saving=false;
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
.controller('AddressModalCtrl',function($scope,$q,$state,AddressService,$modalInstance,address,mode){
	$scope.title=mode;
	$scope.mode=mode;
	$scope.address=address;
  var validate=function(){
    var deferred=$q.defer();
    $scope.$broadcast('event:form_submitted');
    $scope.$on('event:address_valid',function(){
      deferred.resolve(true);
    });
    $scope.$on('event:address_invalid',function(){
      deferred.reject();
    });
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
      }
      AddressService.create(address).then(function(response){
        $scope.creating=false;
        $state.go($state.current,{},{reload: true, inherit: false});
        $modalInstance.close();
      });
    });
	};
});
