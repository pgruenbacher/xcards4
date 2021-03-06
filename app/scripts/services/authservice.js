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
.factory('GuestService', function($http, $q, Session,API,Restangular,localStorageService,AuthenticationService,authService) {
  return{
    login: function(user,password) {
      var tokenRequest=Restangular.oneUrl('oauth/access_token');
      return tokenRequest.get({
        'username':user.email,
        'password':password,
        'grant_type':'password',
        'scope':'default',
        'client_id':'123456',
        'client_secret':'123456'
      }).then(
      function(data,status,headers,config){
        console.log('guest login response',data);
        if(AuthenticationService.saveAuthentication(user)){
          console.log('saved guest, saved authentication token');
        }else{
          console.log('failed to save user');
        }
        localStorageService.set('access_token',data.access_token);
        authService.loginConfirmed(data, function(config) {  // Step 2 & 3
          config.headers.Authorization = data.access_token;
          return config;
        });
        return user;
      });
    }
  };
})
.factory('PermissionService', function($http, Session) {
	var permissionService = {};
	permissionService.isAuthenticated = function () {
    if(typeof Session.user !== 'undefined'&& Session.user!==null){
      if(typeof Session.user.roles==='undefined'){return false;}
      var roles=Session.user.roles;
      for(var i=0; i<roles.length; i++){
        if(roles[i].type==='guest'){
          return false;
        }
      }
      return true;
    }
    return false;
	};
  permissionService.isGuest=function(){
    if(typeof Session.user !=='undefined'&&Session.user!==null){
      if(typeof Session.user.roles==='undefined'){return false;}
      var roles=Session.user.roles;
      for(var i=0; i<roles.length; i++){
        if(roles[i].type==='guest'){
          return true;
        }
      }
    }
    return false;
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
.service('Session', function (localStorageService,Facebook) {
  var self=this;
  function init(){
    Facebook.getLoginStatus(function(response){
      self.saveFacebook(response);
    });
    if (localStorageService.get('user') !== null){
      self.user=localStorageService.get('user');
    }
    if(localStorageService.get('card')!==null){
      self.card=localStorageService.get('card');
    }
    if (localStorageService.get('facebook') !== null){
      self.facebook=localStorageService.get('facebook');
    }
    if(localStorageService.get('survey')!==null){
      self.survey=localStorageService.get('survey');
    }
  }
  init();
  this.saveSurvey=function(survey){
    localStorageService.set('survey',survey);
    self.survey=survey;
    return true;
  };
  this.clearAll=function(){
    self=null;
    self=this; //reinitialize variable
  };
  this.saveFacebook=function(facebook){
    localStorageService.set('facebook',facebook);
    self.facebook=facebook;
    return true;
  };
  this.saveCard=function(card){
    localStorageService.set('card',card);
    self.card=card;
    return true;
  };
  this.destroyCard=function(){
    localStorageService.remove('card');
    self.card=null;
    return true;
  };
  this.create = function (user) {
    localStorageService.set('user',user);
    self.user=user;
    return true;
  };
  this.saveUser=function(user){
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
.factory('AuthenticationService', function($rootScope,Facebook,$http,authService,Restangular, PermissionService, $state,localStorageService,Session) {
  return {
    login: function(user) {
      var self=this;
      var tokenRequest=Restangular.oneUrl('oauth/access_token');
      return tokenRequest.get({
        'username':user.email,
        'password':user.password,
        'grant_type':'password',
        'scope':'default',
        'client_id':'123456',
        'client_secret':'123456'
      }).then(
      function(data,status,headers,config){
        console.log('login response',data);
        if(PermissionService.isGuest()){
          self.copyAssets(Session.user.id);
        }
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
        authService.loginConfirmed(data, function(config) {  // Step 2 & 3
          config.headers.Authorization = data.access_token;
          return config;
        });
        window.location.reload();
        //$state.go($state.current,{reload:true,location:true});
        //$state.go('main.front');
      },
      function(data){
        console.log('error',data);
        $rootScope.$broadcast('event:auth-login-failed', data.status);
      });
    },
    logout: function(user) {
      var self=this;

      if(localStorageService.remove('access_token')&&localStorageService.remove('authentication')&&Session.destroy()){
        $rootScope.$broadcast('event:auth-logout-complete');
        self.destroyAssets();
        Session.clearAll();
        if(typeof Session.facebook !=='undefined'){
          if(Session.facebook.status==='connected'){
            Facebook.logout(function(response){
              console.log(response);
            });            
          }
        }
      }
    },
    forgotPassword:function(email){
    return Restangular.all('forgotPassword').post({email:email});
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
    copyAssets:function(id){
      return Restangular.all('account/copy').post({
        guest:id
      }).then(function(response){
        console.log(response);
      });
    },
    destroyAssets:function(){
      window.localStorage.clear();
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
    find:function(where,email){
      return Restangular.all('users').get('find', {'filter':email, 'where':where});
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
    get:function(id){
      return userAPI.get(id);
    },
    edit:function(id,data){
      return Restangular.one('users',id).put(data);
    },
    shared:function(bool){
      return Restangular.one('shared').get({shared:bool});
    },
    find:function(where,email){
      return userAPI.get('find', {'filter':email, 'where':where});
    },
    create: function(user){
      return userAPI.post(user);
    },
    changePassword:function(change){
      return Restangular.all('change').post(change);
    }
  };
});