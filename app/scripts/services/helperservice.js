'use strict';

/**
 * @ngdoc service
 * @name xcards4App.helperService
 * @description
 * # helperService
 * Factory in the xcards4App.
 */
angular.module('xcards4App')
.factory('ParamService',function($filter){
  /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
  return {
    fixedEncodeURI:function (str) {
      return encodeURIComponent(str).replace(/%5B/g, '%7B').replace(/%5D/g, '%7D');
    },
    param : function(obj) {
      var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
      var self=this;
      console.log('transform request',obj,query);
      for(name in obj) {
        value = obj[name];
        if(value instanceof Array) {
          for(i=0; i<value.length; ++i) {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            if(innerObj[fullSubName] !== undefined && innerObj[fullSubName] !== null){
              query += self.param(innerObj) + '&';
            }
          }
        }
        else if(value instanceof Object) {
          for(subName in value) {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            if(innerObj[fullSubName] !== undefined && innerObj[fullSubName] !== null){
              query += self.param(innerObj) + '&';
            }
          }
        }
        else if(value !== undefined && value !== null){
          query += self.fixedEncodeURI(name) + '=' + self.fixedEncodeURI(value) + '&';
        }
      }
      console.log('transform completed',query);
      return query.length ? query.substr(0, query.length - 1) : query;
    }
  };
})
.factory('CacheAndCall',function($q){
  //See https://github.com/mgonto/restangular/issues/349 for reference
  return {
    getCache: function (type, restangularObj, options, cacheCallback) {
      var cacheKey = restangularObj.getRestangularUrl() + JSON.stringify(options);
      var promise;
      if (type === 'one') {
        promise = restangularObj.get(options);
      }
      else {
        promise = restangularObj.getList(options);
      }
      var deferred = $q.defer();
      promise.then(function(data) {
        localStorage.setItem(cacheKey, JSON.stringify(data));
        cacheCallback(data);
        deferred.resolve(data);
      }, function(data) {
        deferred.reject(data);
      });

      var item = localStorage.getItem(cacheKey);
      if (item) {
        cacheCallback(JSON.parse(item));
      }
      return deferred.promise;
    },

    getCacheOne: function(restangularObj, options, cacheCallback) {
      var self=this;
      return self.getCache('one', restangularObj, options, cacheCallback);
    },

    getCacheList: function(restangularObj, options, cacheCallback) {
      var self=this;
      return self.getCache('list', restangularObj, options, cacheCallback);
    }
  };
});
