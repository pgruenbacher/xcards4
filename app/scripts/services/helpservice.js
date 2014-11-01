'use strict';

/**
 * @ngdoc service
 * @name xcards4App.cardService
 * @description
 * # cardService
 * Factory in the xcards4App.
 */
angular.module('xcards4App')
  .factory('HelpService', function () {
    var names={
      intro:{
        message:'Hi My Name is Bentley! I like pancakes and bunnies! I am your little helper, tell me I\'m a good boy!',
        button:true,
        buttonMessage:'You\'re a good boy!',
        buttonFunction:{
          name:'close',
          fnParams:['oh boy thanks!']
        },
        immediate:true
      }
    };
    return{
      name:function(name){
        return names[name];
      }
    };
  });
