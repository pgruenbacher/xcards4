'use strict';

/**
 * @ngdoc directive
 * @name xcards4App.directive:cloudSponge
 * @description
 * # cloudSponge
 */
angular.module('xcards4App')
  .directive('cloudSponge', function () {
    return {
      templateUrl:'views/partials/cloudsponge.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      	scope.launch=function(arg){
      		cloudsponge.launch(arg);
      	}
      }
    };
  })
  .directive('cloudText',function(){
    return{
      restrict:'A',
      link:function(scope,element,attrs){
        scope.$watch('cloudInput',function(n,o){
          console.log(n);
        });
      }
    }
  });
