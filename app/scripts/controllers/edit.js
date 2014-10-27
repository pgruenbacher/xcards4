'use strict';

/**
 * @ngdoc function
 * @name xcards4App.controller:EditCtrl
 * @description
 * # EditCtrl
 * Controller of the xcards4App
 */
angular.module('xcards4App')
  .controller('EditCtrl', function ($scope,Session) {
    $scope.frontImage=Session.card.cropped;
    $scope.side=true;
    $scope.mode='text';
    $scope.toggle=function(){
    	$scope.side=!$scope.side;
    };
    $scope.message='You can edit here...';
    $scope.continue=function(){
    	console.log($scope.message);
    	$scope.drawBack();
    };
    $scope.toggleMode=function(){
    	$scope.mode=($scope.mode==='text')?'draw':'text';
    };
    $scope.checkMode=function(arg){
    	return arg===$scope.mode;
    };
    $scope.drawBack=function(){
    	var drawing= document.getElementById('backCanvas');
		var canvas = document.createElement('canvas');
		console.log(canvas);
		canvas.width = 340;
		canvas.height = 420;
		// Get the drawing context
		var context = canvas.getContext('2d');
		var html = $scope.message;
		var html=jQuery('#backEditor').html();
		html='<html><body style="padding:0;margin:0;">'+html+'</body></html>';
		//html=style+'<div class="editor">'+html+'</div>';
		var options={
			width: 340,
			height: 420
		};
		rasterizeHTML.drawHTML(html,[],options).then(function (htmlResult) {
			console.log('rasterize result',htmlResult);
		    context.drawImage(htmlResult.image, 0, 0);
		    context.drawImage(drawing,0,0);
		    console.log('open');
		    window.open(canvas.toDataURL('image/png'),'mywindow');
		},function(error){
			console.log(error);
		});
    };
    $scope.brush1='ribbon';
    $scope.color1=[0,0,0];
    $scope.clear=function(side){
    	$scope.$broadcast('clear',{side:side});
    }
    $scope.tinymceOptions = {
    	menubar:false,
    	inline:true,
    	toolbar: 'undo redo | bold italic | fontselect fontsizeselect '
    };
  });
