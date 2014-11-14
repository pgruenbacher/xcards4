'use strict';
/*jshint camelcase:false unused:vars*/
/**
 * @ngdoc function
 * @name xcards4App.controller:ContactCtrl
 * @description
 * # ContactCtrl
 * Controller of the xcards4App
 */
angular.module('xcards4App')
.controller('ContactCtrl',function($scope,Restangular){
	$scope.sendingContact=false;
	$scope.sendContactForm=function(contact){
		$scope.sendingContact=true;
		Restangular.all('contact').post(contact).then(function(response){
			$scope.sendingContact=false;
			if(response.status==='success'){
				$scope.message='your message has been sent';
			}else{
				$scope.message='Sorry, your message could not be sent';
			}
		},function(){
			$scope.message='Sorry, your message could not be sent';
			$scope.sendingContact=false;
		});
	}
});