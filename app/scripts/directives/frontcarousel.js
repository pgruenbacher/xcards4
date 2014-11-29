'use strict';
/*jshint unused:vars*/
/**
 * @ngdoc directive
 * @name xcards4App.directive:frontCarousel
 * @description
 * # frontCarousel
 */
angular.module('xcards4App')
.directive('frontCarousel', function($interval,$timeout) {
	return {
      templateUrl: 'views/partials/frontcarousel.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      	var interval=scope.interval=2500;
	  	var slides=scope.slides=[
	  		{
	  			image:'images/friendsItaly.jpg'
	  		},
	  		{
	  			image:'images/grandmaStreet.jpg'
	  		},
	  		{
	  			image:'images/creditSharingParis.jpg'
	  		}
	  	];
	  	scope.isActive=function(){
	  		return;
	  	};
	  	scope.activeSlide=0;
	  	var intervalSequence;
	  	var initialized;
	  	var init=function(){
	  		initialized=true;
	  		intervalSequence=$interval(function(){
		  		if(scope.activeSlide<=0){
		  			scope.activeSlide=slides.length-1;
		  		}else{
		  			scope.activeSlide--;
		  		}
		  	},interval);
	  	};
	  	var restart=function(){
	  		if(angular.isDefined(initialized)){
	  			return;
	  		}else{
	  			init();
	  		}
	  	};
	  	scope.left=function(){
	  		cancel();
	  		if(scope.activeSlide<=0){
	  			scope.activeSlide=slides.length-1;
	  		}else{
	  			scope.activeSlide--;
	  		}
	  		$timeout(restart,5000);
	  	};
	  	scope.right=function(){
	  		cancel();
	  		console.log(scope.activeSlide>=slides.length-1,scope.activeSlide);
	  		if(scope.activeSlide>=slides.length-1){
	  			scope.activeSlide=0;
	  		}else{
	  			scope.activeSlide++;
	  		}
	  		$timeout(restart,5000);
	  	};
	  	scope.previous=function(index){
	  		if(index===scope.activeSlid+1&&scope.activeSlide<slides.length){
	  			return true;
	  		}else if(scope.activeSlide===slides.length&&index===0){
	  			return true;
	  		}else{
	  			return false;
	  		}
	  	};
	  	var cancel=function(){
	  		initialized=undefined;
	  		if (angular.isDefined(intervalSequence)){
	  			$interval.cancel(intervalSequence);
	  			intervalSequence=undefined;
	  		}
	  	};
	  	init();
      }
    };
});