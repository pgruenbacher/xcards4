'use strict';
/*jshint unused: vars*/
/**
 * @ngdoc directive
 * @name blocksquadApp.directive:navbar
 * @description
 * # navbar
 */
angular.module('xcards4App')
  .directive('footerBar', function ($location) {
    return {
      templateUrl: 'views/partials/footerBar.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      }
    };
  });

