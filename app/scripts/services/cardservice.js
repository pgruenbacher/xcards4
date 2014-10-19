'use strict';

/**
 * @ngdoc service
 * @name xcards4App.cardService
 * @description
 * # cardService
 * Factory in the xcards4App.
 */
angular.module('xcards4App')
  .factory('CardService', function (Restangular) {
    var Card={};
    var CardAPI=Restangular.all('cards');
    return {
      create:function(){
        //return CardAPI.post({ca});
      },
      select:function(){
        Card.selected=true;
        return '';
      },
      prompt:function(){
        if(Card.selected!=='true'){
          return $modal.open({
            templateUrl:'views/partials/cardModal.html',
            controller:'CardsModalCtrl',
            size:'lg'
          });
        }
        console.log(Card.selected);
      }
    };
  });
