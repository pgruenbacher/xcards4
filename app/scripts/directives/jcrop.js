'use strict';
/*jshint unused:vars*/
/**
 * @ngdoc directive
 * @name xcards4App.directive:jcrop
 * @description
 * # jcrop
 */
angular.module('xcards4App')
.directive('jcropPreview',function(){
	return{
		restrict:'E',
		replace:true,
		scope:{}
	};
})
.directive('jcrop', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: { src:'@', selected:'&',loading:'&loading',aspectRatio:'@' },
        link: function(scope,element, attr) {
            var myImg;
            var clear = function() {
                if (myImg) {
                    myImg.next().remove();
                    myImg.remove();
                    myImg = undefined;
                }
            };
            var boundx,boundy,aspectRatio=scope.aspectRatio;
            scope.$watch('src', function(nv) {
                clear();
                if (nv) {
                    element.after('<img />');
                    myImg = element.next();
                    myImg.attr('src',nv);
                    myImg.addClass('hidden');
                    scope.loading(true);
                    var temp = new Image();
                    temp.src = nv;
                    temp.onload = function() {
                        var watchAspect;
                        var width = this.width;
                        var height = this.height;
                        myImg.removeClass('hidden');
                        scope.loading(false);
                        var jcrop_api = $.Jcrop('#jcrop');
                        angular.element(myImg).Jcrop({
                            trackDocument: true,
                            onSelect: function(x) {
                                /*if (!scope.$$phase) {
                                 scope.$apply(function() {
                                 scope.selected({cords: x});
                                 });
                                 }*/
                                scope.selected({c:{cords: x,boundx:boundx,boundy:boundy}});
                            },
                            onChange: function(x){
                            	scope.selected({c:{cords: x,boundx:boundx,boundy:boundy}});
                            },
                            aspectRatio: aspectRatio,
                            boxWidth: 600,
                            trueSize: [width, height]
                        },function(){
                            var self=this;
                        	var bounds=self.getBounds();
                        	boundx = bounds[0];
	      					boundy = bounds[1];
	      					var initialx1=boundx/6;
	      					var initialy1=boundy/9;
	      					var initialx2=boundx-(boundx/6);
	      					var initialy2=(initialx2-initialx1)*(1/aspectRatio);
                            watchAspect=function(value){self.setOptions({aspectRatio:value})};
                        	self.animateTo([initialx1,initialy1,initialx2,initialy2]);
                        });    
                        attr.$observe('aspectRatio',function(value){
                            aspectRatio=value;
                            watchAspect(value);
                        });                    
                    }
                };
            });

            scope.$on('$destroy', clear);
        }
    };
});
