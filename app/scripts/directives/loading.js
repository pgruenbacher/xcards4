'use strict';
/*jshint unused: vars*/
/**
 * @ngdoc directive
 * @name blocksquadApp.directive:navbar
 * @description
 * # navbar
 */
angular.module('xcards4App')
.directive('loadingBunny', function ($location) {
  return {
    template: '<div><img width="auto" src="images/bunny-loading.gif"/><p>{{message}}</p></div>',
    restrict: 'E',
    scope:{'loadingScope':'=','message':'@'},
    link: function link(scope, element, attrs) {
      scope.$watch('loadingScope',function(val){
        if(val){
          angular.element(element).show();
        }else{
          angular.element(element).hide();
        }
      });
      if(attrs.backdrop==='true'){
        element.addClass('loading-bunny');
      }
    }
  };
});
