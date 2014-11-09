'use strict';

/**
 * @ngdoc service
 * @name xcards4App.cardService
 * @description
 * # cardService
 * Factory in the xcards4App.
 */
angular.module('xcards4App')
.factory('HelpService', function (localStorageService) {
  var bentleyList,bentleyObject;
  var names={
    intro:{
      id:'intro',
      message:'Hi My Name is Bentley! I like pancakes and bunnies! I am your little helper, tell me I\'m a good boy!',
      button:true,
      buttonMessage:'You\'re a good boy!',
      buttonFunction:{
        name:'close',
        fnParams:['oh boy thanks!']
      },
      oneTime:true
    },
    pixelDimensions:{
      id:'pixelDimensions',
      message:'Images are printed on our cards at high resolution. If you don\'t want your card to look pixelated, I recommend at least 1500 x 1000 pixel images',
      button:true,
      buttonMessage:'ok thanks',
      buttonFunction:{
        name:'close',
        fnParams:['no problem!']
      },
      oneTime:false
    }
  };
  return{
    help:function(name){
      if(localStorageService.get('bentleyList')){
        bentleyList=localStorageService.get('bentleyList');
      }else{
        bentleyList=[];
      }
      if(typeof names[name].id !=='undefined'){
        bentleyObject=names[name];
        var exists=false;
        bentleyList.map(function(obj, index) {
          if(obj.id === name) {
            exists=true;
          }
        }).filter(isFinite);
        if(bentleyObject.oneTime && exists){
          return false;
        }
        bentleyObject.date=new Date().getTime();
        bentleyList.push(bentleyObject);
        localStorageService.set('bentleyList',bentleyList);
        return bentleyObject;
      }else{
        return false;
      }
    }
  };
});
