'use strict';
/*jshint unused:vars*/
/**
 * @ngdoc directive
 * @name xcards4App.directive:AddressBook
 * @description
 * # AddressBook
 */
angular.module('xcards4App')
.directive('addressBook', function () {
  return {
    template: '<div ng-controller="AddressBookCtrl"></div>',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {
     
    }
  };
})
.directive('smartyInput',function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			console.log(element);
		  
		}
	};
});
