'use strict';
/*jshint camelcase:false, unused:vars*/
/**
 * @ngdoc function
 * @name xcards4App.controller:FrontCtrl
 * @description
 * # FrontCtrl
 * Controller of the xcards4App
 */
angular.module('xcards4App')
.controller('FrontCtrl',function($scope,Session,$stateParams){
	console.log($stateParams);
	if(typeof $stateParams.action !=='undefined'){
		var action=$stateParams.action;
		var status=$stateParams.status;
		switch(action){
			case 'activated':
				if(status==='success'){
					$scope.help('accountActivated');
					break;
				}else{
					$scope.help('accountActivatedFail');
					break;
				}
			case 'reset':
				if(status==='success'){
					$scope.help('passwordReset');
					break;
				}else{
					$scope.help('passwordResetFail');
					break;
				}
		}
	}
});