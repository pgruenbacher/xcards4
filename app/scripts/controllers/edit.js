'use strict';
/*jshint unused:vars, camelcase:false*/
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
    $scope.messageFront='<h1>You can edit here...</h1>';
    $scope.messageBack='You can edit here...';
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
		var canvas = document.getElementById('trialcanvas');
		console.log(canvas);
		canvas.width = 680;
		canvas.height = 840;
		// Get the drawing context
		var context = canvas.getContext('2d');
        context.scale(1,1);
		var html = $scope.message;
		html=jQuery('#backEditor').html();
		html='<html><body style="padding:0;margin:0;">'+html+'</body></html>';
        html=html.replace(/font-size:16px;/,'font-size:32px;');
        html=html.replace(/width: 340px;/,'width:680px;');
        html=html.replace(/height: 420px;/,'height:840px;');
        console.log(html);
		//html=style+'<div class="editor">'+html+'</div>';
		var options={
			width: 680,
			height: 840
		};
		rasterizeHTML.drawHTML(html,[],options).then(function (htmlResult) {
			console.log('rasterize result',htmlResult);
            // Create a Data URI.
            // var DOMURL = window.URL || window.webkitURL || window;

            // var img = new Image();
            // console.log(img);
            // img.width=1020;
            // img.height=1260;
            // var svg = new Blob([htmlResult.svg], {type: 'image/svg+xml;charset=utf-8'});
            // var url = DOMURL.createObjectURL(svg);

            // img.onload = function () {
            //     console.log('img loaded');
            //     $('#trial').append(img);
            //     context.drawImage(img, 0, 0);
            //     window.open(canvas.toDataURL('image/png'),'mywindow');
            //     DOMURL.revokeObjectURL(url);
            // }

            // img.src = url;
		    context.drawImage(htmlResult.image, 0, 0);
            context.drawImage(drawing,0,0);
            window.open(canvas.toDataURL('image/png'),'mywindow');
		},function(error){
			console.log(error);
		});
    };
    $scope.brush1='ribbon';
    $scope.color1=[0,0,0];
    $scope.clear=function(side){
    	$scope.$broadcast('clear',{side:side});
    };
    $scope.tinymceOptionsBack = {
    	menubar:false,
    	inline:true,
        plugins:'textcolor',
    	toolbar: 'undo redo | bold italic | fontselect fontsizeselect | forecolor backcolor',
        content_css : 'styles/custom.css',
        fontsize_formats: '1em 1.2em 1.5em 1.75em 2em',
        font_formats : 'Andale Mono=andale mono,times;'+
                'Arial=arial,helvetica,sans-serif;'+
                'Arial Black=arial black,avant garde;'+
                'Helvetica=helvetica;'+
                'Impact=impact,chicago;'+
                'BOB=bobregular;'+
                'Kilogram=kilogramregular;'+
                'SLIM=slim_joeregular;'+
                'PARIS=parisishregular;'+
                'BIG JOHN=big_johnregular;'+
                'REIS=reisregular'
    };
    $scope.tinymceOptionsFront={
        menubar:false,
        inline:true,
        plugins:'textcolor',
        fontsize_formats: '0.5em 1em 1.2em 1.5em 2em',
        toolbar: 'undo redo | bold italic | fontselect fontsizeselect styleselect | forecolor backcolor',
        style_formats: [
            {title: 'Bold text', inline: 'b'},
            {title: 'Red text', inline: 'span', styles: {color: '#ff0000'}},
            {title: 'Red header', block: 'h1', styles: {color: '#ff0000'}},
            {title: 'Example 1', inline: 'span', classes: 'example1'},
            {title: 'Example 2', inline: 'span', classes: 'example2'},
            {title: 'Table styles'},
            {title: 'Table row 1', selector: 'tr', classes: 'tablerow1'}
        ],
        content_css : 'styles/custom.css',
        font_formats : 'Andale Mono=andale mono,times;'+
                'Arial=arial,helvetica,sans-serif;'+
                'Arial Black=arial black,avant garde;'+
                'Helvetica=helvetica;'+
                'Impact=impact,chicago;'+
                'BOB=bobregular;'+
                'Kilogram=kilogramregular;'+
                'SLIM=slim_joeregular;'+
                'PARIS=parisishregular;'+
                'BIG JOHN=big_johnregular;'+
                'REIS=reisregular'
    };
  });
