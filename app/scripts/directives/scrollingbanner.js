'use strict';
/*jshint unused: vars*/
/**
 * @ngdoc directive
 * @name blocksquadApp.directive:scrollingBanner
 * @description
 * # scrollingBanner
 */
angular.module('xcards4App')
  .directive('scrollingBanner', function ($interval) {
    return {
      template: '<div class="black-border slider" ng-style="{\'background-position\':position}"></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      	var speed = 80;
	    var horizontal = true;
	    scope.position=0;
	    function bgScroll(){
	        // pos -= 1;
	        scope.position -=1;
		}
		$interval(bgScroll, speed);
      }
  };
});