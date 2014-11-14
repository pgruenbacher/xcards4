'use strict';

/**
 * @ngdoc directive
 * @name xcards4App.directive:socialShare
 * @description
 * # socialShare
 */
angular.module('xcards4App')
.directive('socialShare', function ($timeout) {
  return {
    templateUrl:'views/partials/socialshare.html',
    restrict: 'E',
    scope:{
      time:'='
    },
    link: function postLink(scope, element, attrs) {
    	scope.countdown=180;
		  function countdown() {
		    if (scope.countdown === 1) {
		    	scope.countdown='no more';
		      return;
		    }
		    scope.countdown=scope.countdown-1;
		    $timeout(countdown, 1000);
		  }
		 
		  countdown();
    }
	};
});