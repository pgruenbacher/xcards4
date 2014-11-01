'use strict';

/**
 * @ngdoc directive
 * @name xcards4App.directive:cloudSponge
 * @description
 * # cloudSponge
 */
angular.module('xcards4App')
  .directive('bentleyHelp', function ($timeout) {
    return {
      templateUrl:'views/partials/bentley.html',
      restrict: 'E',
      scope:{
        help:'='
      },
      link: function postLink(scope, element, attrs) {
        var profile=element.children();
        scope.bentley={message:'default'};
        var API={
          show:function(animation){
            var self=this;
            profile.removeClass('hidden');
            self.animate('bounceInRight');
          },
          hide:function(){
            profile.addClass('hidden');
          },
          onEnd:function(functionName){
            profile.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', functionName);
          },
          close:function(message){
            var self=this;
            console.log(message);
            scope.bentley.message=(message)?message:'bye!';
            $timeout(function(){
              self.animate('bounceOutRight');
              self.onEnd(self.hide);
            },800);
          },
          animate:function(animation){
            var self
            profile.addClass('animated '+animation);
            $timeout(function(){
              profile.removeClass(animation);
            },1200);
          }
        };
        scope.close=function(){
          API.close();
        };
        scope.$watch('help',function(newValue,oldValue){
          scope.bentley=newValue;
          API.show();
        });
        scope.call=function(el){
          if(typeof el === 'undefined'){
            return;
          }
          // find object
          var fn = API[el.name];
          // is object a function?
          if (typeof fn === 'function'){
            if(typeof el.fnParams !== 'undefined'){
              fn.apply(API, el.fnParams);              
            }else{
              fn();
            }
          }
        };
      }
    };
  });