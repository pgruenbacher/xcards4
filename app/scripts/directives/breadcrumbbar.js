'use strict';

/**
 * @ngdoc directive
 * @name xcards4App.directive:breadcrumbBar
 * @description
 * # breadcrumbBar
 */
angular.module('xcards4App')
  .directive('breadcrumbBar', function (Session,$location) {
    return {
      templateUrl: 'views/partials/breadcrumb.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.card=Session.card;
        scope.isActive = function (viewLocation) {
          	var path=$location.path();
        	return viewLocation === path;
        };
        scope.exists=function(key){
        	if(typeof scope.card[key] !=='undefined'){
        		if(scope.card[key]!==null){
        			if(scope.card[key].length!==0){
        				return true;
        			}
        		}
        	}
        	return false;
        };
      }
    };
  });
