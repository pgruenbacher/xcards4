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
  .controller('EditCtrl', function ($scope,Session,CardService,$q,$state,removeTableTagsFilter) {
    $scope.frontImage=Session.card.croppedImage;
    $scope.loading=0;
    $scope.side=true;
    $scope.alignment='top';
    $scope.finished=0;
    $scope.frontChanged=false;
    $scope.backChanged=false;
    $scope.frontDrawingDimensions={w:862,h:562};
    if(Session.card.orientation==='portrait'){
      $scope.frontDrawingDimensions={w:562,h:862};
    }else{
      $scope.frontDrawingDimensions={h:562,w:862};
    }
    $scope.$watch('finished',function(newValue){
        if(newValue===3){
            $state.go('main.recipients');
        }
    });
    var frontCanvas=document.getElementById('frontCanvas');
    var backCanvas=document.getElementById('backCanvas');
    if(typeof Session.card.frontDrawing !== 'undefined'){
      if(typeof Session.card.frontDrawing.data_blob ==='undefined'){return;}
      var img1 = new Image();
      var ctx1=frontCanvas.getContext('2d');
      img1.onload = function(){
        ctx1.drawImage(img1,0,0); // Or at whatever offset you like
      };
      img1.src = 'data:image/  png;base64,'+Session.card.frontDrawing.data_blob;
    }
    if(typeof Session.card.backDrawing !== 'undefined'){
      if(typeof Session.card.backDrawing.data_blob ==='undefined'){return;}
      var img2 = new Image();
      var ctx2=backCanvas.getContext('2d');
      img2.onload = function(){
        ctx2.drawImage(img2,0,0); // Or at whatever offset you like
      };
      img2.src = 'data:image/  png;base64,'+Session.card.backDrawing.data_blob;
    }
    $scope.mode='text';
    $scope.toggle=function(){
    	$scope.side=!$scope.side;
    };
    if(typeof Session.card.frontMessage !=='undefined'){
      $scope.messageFront=removeTableTagsFilter(Session.card.frontMessage);
      $scope.messageBack=Session.card.backMessage;
    }else{
      $scope.messageFront='Click here to edit...';
      $scope.messageBack='You can edit here...';
    }
    $scope.alignmentToggle=function(label){
      $scope.alignment=label;
    };
    $scope.continue=function(){
      var messageFront,messageBack;
      if($scope.messageFront==='<p>Click here to edit...</p>'){
        messageFront=false;
      }else{
        messageFront=$scope.messageFront;
      }
      if($scope.messageBack==='<p>You can edit here...</p>'){
        messageBack=false;
      }else{
        messageBack=$scope.messageBack;
      }
      $scope.loading=3;
      $scope.finished=0;
      $scope.loadingMessage='rasterizing sheep';
      var frontData=frontCanvas.toDataURL('image/png');
      var backData=backCanvas.toDataURL('image/png');
      var data1 = new FormData();
      data1.append('front',frontData);
      var data2= new FormData();
      data2.append('back',backData);
      console.log($scope.frontChanged);
      if($scope.frontChanged){
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
      }else{
        $scope.loading--;
        $scope.finished++;
      }
      if($scope.backChanged){
        CardService.postMessage(Session.card.id,Session.card.croppedImage.id,data2).then(function(response){
          $scope.loading--;
          console.log(response);
          var card2=Session.card;
          card2[response.drawing.type]=response.drawing;
        Session.saveCard(card2);
            $scope.finished++;
        },function(error){
            $scope.loading=0;
            console.log('error');
        });
      }else{
        $scope.loading--;
        $scope.finished++;
      }
      CardService.postHtmlMessage(Session.card.id,{'back':messageBack,'front':messageFront}).then(function(response){
          $scope.loading--;
          console.log(response);
          var card4=Session.card;
          card4.frontMessage=messageFront?'<table><tr><td style="vertical-align:"'+$scope.alignment+'>'+messageFront+'</td></tr></table>':'';
          card4.backMessage=messageBack?messageBack:'';
          Session.saveCard(card4);
          $scope.finished++;
      },function(error){
          $scope.loading=0;
          console.log('error');
      });
    };
    $scope.toggleMode=function(){
    	$scope.mode=($scope.mode==='text')?'draw':'text';
    };
    $scope.checkMode=function(arg){
    	return arg===$scope.mode;
    };
    $scope.drawFront=function(){
        // var deferred=$q.defer();
        // var drawing= document.getElementById('frontCanvas');
        // //var canvas= document.createElement('canvas');
        // var canvas = document.getElementById('trial2');
        // canvas.width = 1456;
        // canvas.height = 950;
        // Get the drawing context
        // var context = canvas.getContext('2d');
        // //context.scale(1,1);
        // //var html = $scope.message;
        // var html=jQuery('#frontEditor').html();
        // html='<html><body style="padding:0;margin:0;">'+html+'</body></html>';
        // html=html.replace(/font-size:22px;/,'font-size:44px;');
        // html=html.replace(/width: 728px;/,'width:1456px;');
        // html=html.replace(/height: 475px;/,'height:950px;');
        // //html=style+'<div class="editor">'+html+'</div>';
        // var options={
        //     width: 1456,
        //     height: 950
        // };
        // rasterizeHTML.drawHTML(html,[],options).then(function (htmlResult) {
        //     //context.drawImage(htmlResult.image, 0, 0);
        //     console.log(htmlResult);
        //     //context.drawImage(drawing,0,0);
        //     deferred.resolve(canvas.toDataURL('image/png'));
        // },function(error){
        //     deferred.reject('error');
        //     console.log(error);
        // });
        // return deferred.promise;
    };
    $scope.drawBack=function(){
     //    var deferred=$q.defer();
    	// var drawing= document.getElementById('backCanvas');
        //var canvas= document.createElement('canvas');
		// var canvas = document.getElementById('trial2');
		// canvas.width = 680;
		// canvas.height = 840;
		// // Get the drawing context
		// var context = canvas.getContext('2d');
  //       //context.scale(1,1);
		// //var html = $scope.message;
		// var html=jQuery('#backEditor').html();
		// html='<html><body style="padding:0;margin:0;">'+html+'</body></html>';
  //       html=html.replace(/font-size:16px;/,'font-size:32px;');
  //       html=html.replace(/width: 340px;/,'width:680px;');
  //       html=html.replace(/height: 420px;/,'height:840px;');
		// var options={
		// 	width: 680,
		// 	height: 840
		// };
		// rasterizeHTML.drawHTML(html,[],options).then(function (htmlResult) {
  //           console.log(html);
		//     //context.drawImage(htmlResult.image, 0, 0);
  //           //context.drawImage(drawing,0,0);
  //           //deferred.resolve(canvas.toDataURL('image/png'));
  //           //window.open(canvas.toDataURL('image/png'),'mywindow');
		// },function(error){
  //           deferred.reject('error');
		// 	console.log(error);
		// });
        // return deferred.promise;
    };
    $scope.frontBrush='signature';
    $scope.backBrush='signature';
    $scope.frontColor='rgb(0,0,0)';
    $scope.backColor='rgb(0,0,0)';
    $scope.clear=function(side){
    	$scope.$broadcast('clear',{side:side});
    };
    $scope.tinymceOptionsBack = {
    	menubar:false,
    	inline:true,
        plugins:'textcolor',
        force_hex_style_colors : true,
    	toolbar: 'undo redo | bold italic | fontselect fontsizeselect | forecolor backcolor',
        content_css : 'styles/custom.css',
        fontsize_formats: '1em 1.2em 1.5em 1.75em 2em',
        font_formats : 'Andale Mono=andale mono,times;'+
                'Arial=arial,helvetica,sans-serif;'+
                'Arial Black=arial black,avant garde;'+
                'Helvetica=helvetica;'+
                'Dawn=dawning_of_a_new_dayregular;'+
                'La_Belle=la_belle_auroreregular;'+
                'Bedtime=bedtime_storiesregular;'+
                'In My Heart=always_in_my_heartregular;'+
                'CUCUMBERS=attack_of_the_cucumbersRg;'+
                'ALLURA=alluraregular;'
    };
    $scope.tinymceOptionsFront={
        menubar:false,
        inline:true,
        plugins:'textcolor',
        force_hex_style_colors : true,
        fontsize_formats: '0.5em 1em 1.2em 1.5em 2em 2.5em 3em 4em',
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | fontselect fontsizeselect styleselect | forecolor ',
        style_formats: [
            {title: 'Dark Background', items:[
              {title:'black background', block: 'div', styles: {background: '#000000'}},
              {title:'white background', block: 'div', styles: {background: '#fff',color:'#000'}},
              {title:'maroon background', block: 'div', styles: {background: '#330000'}},
              {title:'green background', block: 'div', styles: {background: '#0D4019'}},
              {title:'blue background', block: 'div', styles: {background: '#151360'}},
            ]},
            {title: 'Black Shadow', inline: 'span', classes:'black-shadow'},
            {title: 'White Shadow', inline: 'span', classes:'white-shadow'}
        ],
        content_css : 'styles/custom.css',
        font_formats : 'Andale Mono=andale mono,times;'+
                'Arial=arial,helvetica,sans-serif;'+
                'CRAYON=colored_crayonsregular;'+
                'AMERICA=american_dreamregular;'+
                'USA=united_brkregular;'+
                'BOB=bobregular;'+
                'Kilogram=kilogramregular;'+
                'SLIM=slim_joeregular;'+
                'PARIS=parisishregular;'+
                'BIG JOHN=big_johnregular;'+
                'REIS=reisregular;'+
                'ALLURA=alluraregular;'+
                'CUTIE=hey_cutieregular;'+
                'GRAFFI=throwupzregular;'+
                'BLOOD=bloodlustregular;'+
                'FEAST=feast_of_flesh_bbregular;'
    };
  });
