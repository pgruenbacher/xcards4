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
  .controller('EditCtrl', function ($scope,Session,CardService,$q,$state) {
    $scope.frontImage=Session.card.croppedImage;
    $scope.loading=0;
    $scope.side=true;
    $scope.finished=0;
    $scope.$watch('finished',function(newValue){
        if(newValue===2){
            $state.go('main.recipients');
        }
    });
    $scope.mode='text';
    $scope.toggle=function(){
    	$scope.side=!$scope.side;
    };
    $scope.messageFront='You can edit here...';
    $scope.messageBack='You can edit here...';
    $scope.continue=function(){
        $scope.loading=2;
        $scope.loadingMessage='rasterizing sheep';
    	$scope.drawFront().then(function(imageUrl){
            var data1 = new FormData();
            data1.append('front',imageUrl);
            CardService.postMessage(Session.card.id,Session.card.croppedImage.id,data1).then(function(response){
                $scope.loading--;
                console.log(response);
                var card1=Session.card;
                card1[response.drawing.type]=response.drawing;
                Session.saveCard(card1);
                $scope.finished++;
            },function(error){
                $scope.loading=0;
                console.log('error');
            });
        });
        $scope.drawBack().then(function(imageUrl){
            var data2 = new FormData();
            data2.append('back',imageUrl);
            CardService.postMessage(Session.card.id,Session.card.croppedImage.id,data2).then(function(response){
                $scope.loading --;
                console.log(response);
                var card2=Session.card;
                card2[response.drawing.type]=response.drawing;
                Session.saveCard(card2);
                $scope.finished++;
            },function(error){
                $scope.loading=0;
                console.log('error');
            });
        });
    };
    $scope.toggleMode=function(){
    	$scope.mode=($scope.mode==='text')?'draw':'text';
    };
    $scope.checkMode=function(arg){
    	return arg===$scope.mode;
    };
    $scope.drawFront=function(){
        var deferred=$q.defer();
        var drawing= document.getElementById('frontCanvas');
        var canvas= document.createElement('canvas');
        //var canvas = document.getElementById('frontTrialCanvas');
        canvas.width = 1456;
        canvas.height = 950;
        // Get the drawing context
        var context = canvas.getContext('2d');
        //context.scale(1,1);
        //var html = $scope.message;
        var html=jQuery('#frontEditor').html();
        html='<html><body style="padding:0;margin:0;">'+html+'</body></html>';
        html=html.replace(/font-size:22px;/,'font-size:44px;');
        html=html.replace(/width: 728px;/,'width:1456px;');
        html=html.replace(/height: 475px;/,'height:950px;');
        //html=style+'<div class="editor">'+html+'</div>';
        var options={
            width: 1456,
            height: 950
        };
        rasterizeHTML.drawHTML(html,[],options).then(function (htmlResult) {
            context.drawImage(htmlResult.image, 0, 0);
            context.drawImage(drawing,0,0);
            deferred.resolve(canvas.toDataURL('image/png'));
        },function(error){
            deferred.reject('error');
            console.log(error);
        });
        return deferred.promise;
    };
    $scope.drawBack=function(){
        var deferred=$q.defer();
    	var drawing= document.getElementById('backCanvas');
        var canvas= document.createElement('canvas');
		//var canvas = document.getElementById('trialcanvas');
		canvas.width = 680;
		canvas.height = 840;
		// Get the drawing context
		var context = canvas.getContext('2d');
        //context.scale(1,1);
		//var html = $scope.message;
		var html=jQuery('#backEditor').html();
		html='<html><body style="padding:0;margin:0;">'+html+'</body></html>';
        html=html.replace(/font-size:16px;/,'font-size:32px;');
        html=html.replace(/width: 340px;/,'width:680px;');
        html=html.replace(/height: 420px;/,'height:840px;');
		var options={
			width: 680,
			height: 840
		};
		rasterizeHTML.drawHTML(html,[],options).then(function (htmlResult) {
		    context.drawImage(htmlResult.image, 0, 0);
            context.drawImage(drawing,0,0);
            deferred.resolve(canvas.toDataURL('image/png'));
            //window.open(canvas.toDataURL('image/png'),'mywindow');
		},function(error){
            deferred.reject('error');
			console.log(error);
		});
        return deferred.promise;
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
