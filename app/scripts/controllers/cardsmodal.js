'use strict';
/*jshint unused:vars*/
/**
 * @ngdoc function
 * @name xcards4App.controller:CardsmodalCtrl
 * @description
 * # CardsmodalCtrl
 * Controller of the xcards4App
 */
angular.module('xcards4App')
  .controller('CardsModalCtrl', function ($scope,CardService,$modalInstance) {
  	$scope.cards=[{id:1}];
  	$scope.select=function(card){
  		CardService.select(card).then(function(){
  			$scope.close();
  		});
  	};
  	$scope.close=function(){
  		$modalInstance.close();
  	};
  });
