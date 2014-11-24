'use strict';
/*jshint unused:vars,camelcase:false*/
/**
 * @ngdoc function
 * @name xcards4App.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the xcards4App
 */
angular.module('xcards4App')
.controller('AccountCtrl', function ($scope,Session,UserService) {
	$scope.user=Session.user;
	$scope.editUser=false;
	$scope.loading=false;
	$scope.toggleUserForm=function(){
		$scope.editUser=!$scope.editUser;
	};
	$scope.address={};
	$scope.editUserSubmit=function(user){
		$scope.loading=true;
		var data={
			name:user.name,
			number:user.phone_number
		};
		if(typeof user.home_address.zipCode !=='undefined'){
			data.address=user.home_address.address;
			data.plus4Code=user.home_address.plus4Code;
			data.zipCode=user.home_address.zipCode;
			data.cityName=user.home_address.cityName;
			data.stateAbbreviation=user.home_address.stateAbbreviation;
			data.deliveryLine1=user.home_address.deliveryLine1;
			data.lastLine=user.home_address.lastLine;
		}
		UserService.edit(user.id,data).then(function(response){
			$scope.loading=false;
			console.log(response);
			var u=Session.user;
			u.home_address=user.home_address;
			Session.saveUser(user);
		},function(){
			$scope.loading=false;
		});
	};
});