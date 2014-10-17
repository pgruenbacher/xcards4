'use strict';
/*jshint unused:vars*/
/**
 * @ngdoc service
 * @name xcards4App.AddressService
 * @description
 * # AddressService
 * Factory in the xcards4App.
 */
angular.module('xcards4App')
  .factory('AddressService', function(Restangular,CacheAndCall) {
    var addresses=[];
    var api=Restangular.all('addresses');
    // Public API here
    return {
      all: function(callback){
        CacheAndCall.getCacheList(Restangular.all('addresses'), {}, function (value) {
          addresses=value;
          callback(value);
        });
      },
      get: function(addressId) {
        return addresses[addressId];
      },
      put: function(address){
        return address.put();
      },
      copy:function(addressId){
        return Restangular.copy(addresses[addressId]);
      },
      create:function(address){
        return api.post(address);
      }
    };
  });
