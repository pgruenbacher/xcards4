'use strict';
/*jshint unused:vars,camelcase:false*/
/**
 * @ngdoc function
 * @name xcards4App.controller:ShareCtrl
 * @description
 * # ShareCtrl
 * Controller of the xcards4App
 */
angular.module('xcards4App')
.controller('ShareCtrl',function($scope,Session,$state,$modal,
	AddressService,validEmailFilter,validPhoneNumberFilter,
	byIdFilter,TransferService,UserService)
{
	$scope.recipient={};
	$scope.credits=0;
	$scope.showAddresses=false;
	$scope.loading=false;
	$scope.recipientExists=false;
	AddressService.all(function(addresses){
		$scope.addresses=addresses;
	});
	$scope.creditsLeft=Session.user.credits;
	$scope.subtract=function(){
		$scope.creditsLeft=Session.user.credits-$scope.credits;
	};
	$scope.user=Session.user;
	$scope.selectedAddresses=[];
	$scope.select=function(address){
		var existed=false;
		for (var i=0; i<$scope.selectedAddresses.length; i++) {
		  if ($scope.selectedAddresses[i].id === address.id){
		    $scope.selectedAddresses.splice(i,1);
		    existed=true;
		  }
		}
		if(existed===false){
		  $scope.selectedAddresses.push(address);
		}
	};
	 $scope.isSelected=function(id){
	    for (var i=0; i<$scope.selectedAddresses.length; i++) {
	      if ($scope.selectedAddresses[i].id === id){
          return true;
	      }
	    }
	    return false;
	  };
	  $scope.checkEmail=function(){
	  	var recipient=$scope.recipient;
	  	if(validEmailFilter(recipient.email)){
	  		UserService.find('email',recipient.email).then(function(response){
					if(response.status==='found'){
	  				$scope.recipientExists=true;
	  				$scope.recipient.name=response.name;
	  			}else{
	  				$scope.recipientExists=false;
	  				$scope.checkPhoneNumber();
	  			}
	  		});
	  	}
	  };
	  $scope.checkPhoneNumber=function(){
	  	var recipient=$scope.recipient;
	  	if(typeof recipient.number !=='undefined'){
	  		recipient.number=recipient.number.replace(/\D/g,'');
	  	}	  		
	  	if(validPhoneNumberFilter(recipient.number)){
	  		UserService.find('phone_number',recipient.number).then(function(response){
	  			if(response.status==='found'){
	  				$scope.recipientExists=true;
	  				$scope.recipient.name=response.name;
	  			}else{
	  				$scope.recipientExists=false;
	  				$scope.checkEmail();
	  			}
	  		});
	  	}
	  };
	  $scope.submitShare=function(recipient){
	  	if(!$scope.credits&&!$scope.selectedAddresses.length){
	  		alert('you need to select addresses or credits to share!');
	  		return;
	  	}else{
	  		if(recipient.number){recipient.number=recipient.number.replace(/\D/g,'');}
	  		$scope.loading=true;
	  		var addressIds=byIdFilter($scope.selectedAddresses);
	  		TransferService.create({
	  			recipient:recipient,
	  			addresses:addressIds,
	  			credits:$scope.credits
	  		}).then(function(response){
	  			$scope.loading=false;
	  			if(response.status){
	  				if($scope.credits>0){
	  					$scope.help('sharedCreditsSuccess');
	  				}else{
	  					$scope.help('sharedSuccess');
	  				}
	  			}else{
	  				$scope.help('error');
	  			}
	  		},function(){
	  			$scope.loading=false;
	  			$scope.help('error');
	  		});
	  	}
	  };
});