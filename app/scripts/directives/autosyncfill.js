'use strict';
/*jshint unused:vars*/
/**
 * @ngdoc directive
 * @name xcards4App.directive:autoSyncFill
 * @description
 * # autoSyncFill
 */
angular.module('xcards4App')
.directive('autoFillSync', function($timeout) {
	return {
		restrict:'A',
		require: 'ngModel',
		link: function(scope, elem, attrs, ngModel) {
		  var origVal = elem.val();
		  $timeout(function () {
		    var newVal = elem.val();
		    if(ngModel.$pristine && origVal !== newVal) {
		      ngModel.$setViewValue(newVal);
		    }
		  }, 500);
		}
	};
});
