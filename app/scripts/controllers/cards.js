'use strict';
/*jshint camelcase:false, unused:vars*/
/**
 * @ngdoc function
 * @name xcards4App.controller:CardsCtrl
 * @description
 * # CardsCtrl
 * Controller of the xcards4App
 */
angular.module('xcards4App')
.controller('CardsCtrl',function($scope,Session,$sce,$state,$modal,CardService){
	CardService.all(function(cards){
		console.log(cards);
		$scope.cards=cards;
	});
	$scope.next=function(id){
		return CardService.next(id);
	};
	$scope.use=function(card){
		CardService.use(card);
	};
	$scope.reuse=function(card){
		CardService.reuse(card.id);
	};
});

