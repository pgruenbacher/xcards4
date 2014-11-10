'use strict';
/*jshint unused: vars*/
/**
 * @ngdoc directive
 * @name blocksquadApp.directive:navbar
 * @description
 * # navbar
 */
angular.module('xcards4App')
  .directive('navbar', function ($location) {
    return {
      templateUrl: 'views/partials/navbar.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        var path;
        scope.isActive = function (viewLocation) {
          path=$location.path();
          if(viewLocation==='build'){
            console.log(path);
            return path==='/upload'||path==='/crop'||path==='/edit'||path==='/recipients'||path==='/preview';
          } 
	        return viewLocation === path;
	    };
      }
    };
  });

