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
    },
    accountRegistered:{
      id:'accountRegistered',
      message:'Thanks for registering! Check your email to activate, then login!',
      button:true,
      buttonMessage:'roger that',
      buttonFunction:{
        name:'close',
        fnParams:['affirmative']
      },
      oneTime:false
    },
    forgotPassword:{
      id:'forgotPassword',
      message:'An email has been sent to you with a link to reset your password',
      button:true,
      buttonMessage:'thanks',
      buttonFunction:{
        name:'close',
        fnParams:['I love mittens!']
      }
    },
    accountActivated:{
      id:'accountActivated',
      message:'Your account has been activated, go ahead and login!',
      button:false
    },
    passwordReset:{
      id:'passwordReset',
      message:'Your password has been reset, you can login in with your temporary password',
      button:false
    },
    passwordResetFail:{
      id:'passwordResetFail',
      message:'Your password could not be reset, did you use the correct email link?',
      button:false
    },
    accountActivatedFail:{
      id:'accountActivatedFail',
      message:'Your activation link did not work, your account may already be activated',
      button:false
    }
  };
  return{
    help:function(name){
      if(localStorageService.get('bentleyList')){
        bentleyList=localStorageService.get('bentleyList');
      }else{
        bentleyList=[];
      }
      if(typeof names[name] !=='undefined'){
        bentleyObject=names[name];
        var exists=false;
        bentleyList.map(function(obj, index) {
          if(obj.id === name) {
            exists=true;
          }
        }).filter(isFinite);
        if(bentleyObject.oneTime && exists){
          console.log('one time');
          return false;
        }
        bentleyObject.date=new Date().getTime();
        bentleyList.push(bentleyObject);
        localStorageService.set('bentleyList',bentleyList);
        console.log(bentleyObject);
        return bentleyObject;
      }else{
        return false;
      }
    }
  };
});
