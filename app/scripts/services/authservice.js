'use strict';
/*jshint unused:vars, camelcase: false */
/**
 * @ngdoc service
 * @name xcards4App.permissionService
 * @description
 * # permissionService
 * Service in the xcards4App.
 */
angular.module('xcards4App')
.factory('GuestService', function($http, Session,API) {
  return{
    create:function () {
      return $http.get(API.domain+'/guest');
    }
  };
})
.factory('PermissionService', function($http, Session) {
	var permissionService = {};
	permissionService.isAuthenticated = function () {
    if(Session.user !== null && typeof Session.user !== 'undefined' && Session.user.roles[0].type !== 'guest'){
      return true;
    }else{console.log(Session.user.roles.type);

      return false;
    }
	};
	permissionService.isAuthorized = function (authorizedRoles) {
    if(Session.user !==null && typeof Session.user !== 'undefined'){
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (permissionService.isAuthenticated() && Session.user.roles.map(function(x) {return x.type; }).indexOf(authorizedRoles[0]) !== -1);
    }else{
      return false;
    }
	  
	};
	return permissionService;
})
// .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
//   return {
//     responseError: function (response) { 
//       $rootScope.$broadcast({
//         401: AUTH_EVENTS.notAuthenticated,
//         403: AUTH_EVENTS.notAuthorized,
//         419: AUTH_EVENTS.sessionTimeout,
//         440: AUTH_EVENTS.sessionTimeout
//       }[response.status], response);
//       return $q.reject(response);
//     }
//   };
// })
.service('Session', function (localStorageService) {
  var self=this;
  function init(){
    if (localStorageService.get('user') !== null){
      self.user=localStorageService.get('user');
    }
  }
  init();
  this.create = function (user) {
    localStorageService.set('user',user);
    self.user=user;
    return true;
  };
  this.destroy = function () {
    localStorageService.remove('user');
    self.user=null;
    return true;
  };
  return this;
})
.factory('AuthenticationService', function($rootScope,$http,authService,Restangular,$state,localStorageService,Session) {
  return {
    login: function(user) {
      var self=this;
      console.log('login');
      var tokenRequest=Restangular.oneUrl('oauth/access_token');
      tokenRequest.get({
        'username':user.email,
        'password':user.password,
        'grant_type':'password',
        'scope':'default',
        'client_id':'123456',
        'client_secret':'123456'
      }).then(
      function(data,status,headers,config){
        console.log('login response',data);
        if(self.saveAuthentication(user)){
          console.log('saved user, saved authentication token');
        }else{
          console.log('failed to save user');
        }
        localStorageService.set('access_token',data.access_token);
          // Step 1
        // Need to inform the http-auth-interceptor that
        // the user has logged in successfully.  To do this, we pass in a function that
        // will configure the request headers with the authorization token so
        // previously failed requests(aka with status == 401) will be resent with the
        // authorization token placed in the header
        window.location.reload();
        authService.loginConfirmed(data, function(config) {  // Step 2 & 3
          config.headers.Authorization = data.access_token;
          return config;
        });
        $state.go('main.front');
      },
      function(data){
        console.log('error',data);
        $rootScope.$broadcast('event:auth-login-failed', data.status);
      });
    },
    logout: function(user) {
      if(localStorageService.remove('access_token')&&localStorageService.remove('authentication')&&Session.destroy()){
        $rootScope.$broadcast('event:auth-logout-complete');
      }
    },
    loginCancelled: function() {
      authService.loginCancelled();
    },
    saveAuthentication:function(authentication){
      var stored=localStorageService.set('authentication',authentication);
      if(stored){
        return true;
      }else{
        return false;
      }
    },
    checkAuthentication:function(callback){
  		return Restangular.oneUrl('check').get();
    },
    getAuthentication:function(){
      var authentication=localStorageService.get('authentication');
      if(authentication){
        return authentication;
      }else{
        return false;
      }
    },
    getAccessToken:function(){
      return localStorageService.get('access_token');
    }

  };
})
.factory('UserService',function($http,Restangular,localStorageService){
  var userAPI=Restangular.all('user');
  return{
    authenticate:function(){
      Restangular.all('user/auth').getList().then(function(response){
        localStorageService.set('AuthUser',response[0]);
        return response[0];
      },function(response){
        console.log(response);
      });
    },
    user:function(){
      return localStorageService.get('AuthUser');
    },
    get:function(id){
      return userAPI.get(id);
    },
    find:function(email){
      return userAPI.get('find', {'filter':email, 'where':'email'});
    },
    create: function(user){
      return userAPI.post(user);
    },
    changePassword:function(change){
      return Restangular.all('change').post(change);
    }
  };
});