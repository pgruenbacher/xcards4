'use strict';
/*jshint unused:vars*/
/**
 * @ngdoc service
 * @name xcards4App.cardService
 * @description
 * # cardService
 * Factory in the xcards4App.
 */
angular.module('xcards4App')
  .factory('CardService', function ($q,Restangular,Session,$modal,localStorageService) {
    var Card={};
    var CardAPI=Restangular.all('cards');
    return {
      create:function(card){
        console.log('create',card);
        return CardAPI.post({
          settingId:card.settingId
        });
      },
      crop:function(cardId,imageId,coords){
        var data={
          x: Math.round(coords.x),
          y: Math.round(coords.y),
          w: Math.round(coords.w),
          h: Math.round(coords.h)
        };
        return Restangular.one('cards',cardId).one('images',imageId).get(data);
      },
      get:function(cardId){
        return Restangular.one('cards',cardId).get();
      },
      check:function(){
        var deferred=$q.defer();
        //var promise=deferred.promise;
        console.log('check');
        var self=this;
        if(typeof Session.card !=='undefined'){
           deferred.resolve(Session.card);
        }else{
          console.log('prompt');
          self.prompt().then(function(card){
            console.log('resolved check',card);
            deferred.resolve(card);
          },function(){
            deferred.reject('prompt dismissed');
          });
        }
        return deferred.promise;
      },
      select:function(card){
        Session.destroyCard();
        return this.create(card).then(function(response){
          if(response.card){
            Session.saveCard(response.card);
          }
        });
      },
      createRecipients:function(cardId,selected){
        return Restangular.one('cards',cardId).all('addresses').post({recipients:selected});
      },
      postMessage:function(cardId,imageId,data){
        console.log('message',cardId,imageId,data);
        return Restangular.one('cards',cardId).one('images',imageId).all('message')
        .withHttpConfig({
          transformRequest: angular.identity
        })
        .post(data,{}, {'Content-Type': undefined,'Authorization':localStorageService.get('access_token')});
      },
      prompt:function(){
        var deferred=$q.defer();
        var selectModal=$modal.open({
          templateUrl:'views/partials/cardModal.html',
          controller:'CardsModalCtrl',
          size:'lg'
        });
        selectModal.result.then(function(){
          console.log('resolve modal',Session.card);
          deferred.resolve(Session.card);
        },function(){
          deferred.reject('modal dismissed');
        });
        return deferred.promise;
      }
    };
  });
