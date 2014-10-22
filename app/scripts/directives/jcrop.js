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
        scope: { src:'@', selected:'&' },
        link: function(scope,element, attr) {
            var myImg;
            var clear = function() {
                if (myImg) {
                    myImg.next().remove();
                    myImg.remove();
                    myImg = undefined;
                }
            };
            var boundx,boundy;
            scope.$watch('src', function(nv) {
                clear();
                if (nv) {
                    element.after('<img />');
                    myImg = element.next();
                    myImg.attr('src',nv);

                    var temp = new Image();
                    temp.src = nv;
                    temp.onload = function() {
                        var width = this.width;
                        var height = this.height;

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
                            aspectRatio: 1.533,
                            boxWidth: 600,
                            trueSize: [width, height]
                        },function(){
                        	var bounds=this.getBounds();
                        	boundx = bounds[0];
	      					boundy = bounds[1];
	      					var initialx1=boundx/6;
	      					var initialy1=boundy/9;
	      					var initialx2=boundx-(boundx/6);
	      					var initialy2=(initialx2-initialx1)*(3.75/5.75);
                        	this.animateTo([initialx1,initialy1,initialx2,initialy2]);
                        });
                    }
                };
            });

            scope.$on('$destroy', clear);
        }
    };
});
