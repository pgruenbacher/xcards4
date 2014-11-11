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
	$scope.deleting={};
	CardService.all(function(cards){
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
	$scope.remove=function(id){
		$scope.deleting[id]=true;
		CardService.remove(id).then(function(response){
			console.log(response);
			for(var i=0; i<$scope.cards.length; i++){
				if($scope.cards[i].id===id){
					$scope.cards.splice(i,1);
					break;
				}
			}
			$scope.deleting[id]=false;
		},function(){
		$scope.deleting[id]=false;
		});
	};
});

