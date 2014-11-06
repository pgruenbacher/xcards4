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
.factory('CreditService', function ($q,Restangular,Session,$modal,localStorageService) {
    return {
    	useCredits:function(cardId){
    		return Restangular.all('creditOrder').post({
    			card:cardId
    		});
    	}
    };
});