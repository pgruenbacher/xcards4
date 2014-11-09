'use strict';
/*jshint unused:vars*/
/**
 * @ngdoc service
 * @name xcards4App.RequestService
 * @description
 * # RequstSerivce
 * Factory in the xcards4App.
 */
angular.module('xcards4App')
  .factory('RequestService', function ($q,Restangular,Session,$modal,localStorageService) {
    var requestAPI=Restangular.all('requests');
    return{
      check:function(array){
        return Restangular.all('requests/check').post(array);
      },
      request:function(array){
        return requestAPI.post(array);
      }
    };
  });
