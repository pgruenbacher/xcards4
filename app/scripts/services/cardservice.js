'use strict';

/**
 * @ngdoc service
 * @name xcards4App.cardService
 * @description
 * # cardService
 * Factory in the xcards4App.
 */
angular.module('xcards4App')
  .factory('CardService', function (Restangular,Session,$modal) {
    var Card={};
    var CardAPI=Restangular.all('cards');
    return {
      create:function(card){
        return CardAPI.post({
          settingId:card.id
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
      check:function(){
        var self=this;
        if(typeof Session.card !=='undefined'){

        }else{
          return self.prompt();
        }
      },
      select:function(card){
        Session.destroyCard();
        return this.create(card).then(function(){
          Session.saveCard(card);
        });
      },
      prompt:function(){
        if(Card.selected!=='true'){
          return $modal.open({
            templateUrl:'views/partials/cardModal.html',
            controller:'CardsModalCtrl',
            size:'lg'
          });
        }
      }
    };
  });
