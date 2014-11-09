'use strict';
/*jshint unused: vars*/
/**
 * @ngdoc directive
 * @name blocksquadApp.directive:navbar
 * @description
 * # navbar
 */
angular.module('xcards4App')
  .directive('accountMenu', function ($location) {
    return {
      templateUrl: 'views/partials/accountMenu.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.isActive = function (viewLocation) { 
	        return viewLocation === $location.path();
	    };
      }
    };
  });