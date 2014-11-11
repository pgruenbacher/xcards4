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
  .factory('CardService', function ($q,$state,Restangular,Session,$modal,localStorageService,CacheAndCall) {
    var Cards=[];
    var CardAPI=Restangular.all('cards');
    return {
      all:function(callback){
        CacheAndCall.getCacheList(CardAPI, {}, function (value) {
          Cards=value;
          callback(value);
        });
      },
      create:function(card){
        console.log('create',card);
        return CardAPI.post({
          settingId:card.settingId
        });
      },
      next:function(card){
        if(card.croppedImage === null){
          return 'crop';
        }else if(card.frontDrawing === null){
          return 'edit';
        }else if(card.recipients === null){
          return 'recipients';
        }else{
          return 'preview';
        }
      },
      reuse:function(cardId){
        return Restangular.one('cards',cardId).get({reuse:true}).then(function(response){
          Cards.push(response.card);
          Session.saveCard(response.card);
          $state.go('main.recipients');
        });
      },
      use:function(card){
        var self=this;
        Session.saveCard(card);
        $state.go('main.'+self.next(card));
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
        var self=this;
        if(typeof Session.card !=='undefined' && Session.card!==null){
          deferred.resolve(Session.card);
        }else{
          self.prompt().then(function(card){
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
        return Restangular.one('cards',cardId).one('images',imageId).all('message')
        .withHttpConfig({
          transformRequest: angular.identity
        })
        .post(data,{}, {'Content-Type': undefined,'Authorization':localStorageService.get('access_token')});
      },
      postHtmlMessage:function(cardId,data){
        return Restangular.one('cards',cardId).all('message').post(data);
      },
      remove:function(id){
        return Restangular.one('cards',id).remove().then(function(response){
          var cacheKey = Restangular.all('cards').getRestangularUrl()+JSON.stringify({});
          var cache= JSON.parse(localStorage.getItem(cacheKey));
          for(var i=0; i<cache.length; i++){
            console.log(cache[i].id,id);
            if(cache[i].id===id){
              cache.splice(i,1);
              break;
            }
          }
          localStorage.setItem(cacheKey, JSON.stringify(cache));
          return response;
        });
      },
      prompt:function(){
        console.log('prompted');
        var deferred=$q.defer();
        var selectModal=$modal.open({
          templateUrl:'views/partials/cardModal.html',
          controller:'CardsModalCtrl',
          size:'lg'
        });
        selectModal.result.then(function(){
          deferred.resolve(Session.card);
        },function(){
          deferred.reject('modal dismissed');
        });
        return deferred.promise;
      }
    };
  });
