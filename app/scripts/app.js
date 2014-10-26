'use strict';

/**
 * @ngdoc overview
 * @name xcards4App
 * @description
 * # xcards4App
 *
 * Main module of the application.
 */
angular
  .module('xcards4App', [
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'ngTouch',
    'ui.tinymce',
    'ui.router',
    'ui.bootstrap',
    'restangular',
  	'LocalStorageModule',
    'http-auth-interceptor',
    'angularFileUpload'
  ])
.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('main',{
  	url:'',
    abstract:true,
    templateUrl:'views/main.html',
    controller:'MainCtrl',
    resolve:{
      user:function(AuthenticationService,Session,GuestService){
        return AuthenticationService.checkAuthentication().then(function(r){
          if(r.valid){
            Session.create(r.user);
            return {user:r.user};
          }else{
            GuestService.login(r.user,r.password).then(function(r){
              console.log('guest made',r);
              Session.create(r.user);
              return{user:r.user};
            });
          }
        },function(error){
          console.log('couldn\'t resolve, set default guest',error);
          return {
            role:'guest'
          };
        });
      }
    }
  })
  .state('main.front',{
    url:'/front',
    templateUrl:'views/front.html'
  })
  .state('main.admin',{
    url:'/admin',
    templateUrl:'views/admin.html',
    data:{
      authorizedRoles:'admin'
    }
  })
  .state('main.upload',{
    url:'/upload',
    templateUrl:'views/upload.html',
    controller:'UploadCtrl'
  })
  .state('main.crop',{
    url:'/crop',
    templateUrl:'views/crop.html',
    controller:'CropCtrl'
  })
  .state('main.edit',{
    url:'/edit',
    templateUrl:'views/edit.html',
    controller:'EditCtrl'
  })
  .state('main.addressBook',{
    url:'/addressBook',
    templateUrl:'views/addressBook.html'
  });
  $urlRouterProvider.otherwise('/front');
})
// .config(['$httpProvider', function($httpProvider) {
//     // Use x-www-form-urlencoded Content-Type
//     $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
//     $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
//     delete $httpProvider.defaults.headers.common['X-Requested-With'];
//   }
// ])
.run(function($rootScope, $http, $injector,$state, AuthenticationService,ParamService) {
  $injector.get('$http').defaults.transformRequest = function(data, headersGetter) {
    var accessToken=AuthenticationService.getAccessToken();
    if (accessToken){
      headersGetter().Authorization = 'Bearer '+ accessToken;
    }
    if (data) {
      console.log('data',data);
      return angular.isObject(data) && String(data) !== '[object File]' ? ParamService.param(data) : data;
    }
  };
})
// .config(function ($httpProvider) {
//   $httpProvider.interceptors.push([
//     '$injector',
//     function ($injector) {
//       return $injector.get('AuthInterceptor');
//     }
//   ]);
// })
.run(function ($rootScope, AUTH_EVENTS, PermissionService) {
  $rootScope.$on('$stateChangeStart', function (event, next) {
    if(typeof next.data !== 'undefined'){
      var authorizedRoles = next.data.authorizedRoles;
      if (!PermissionService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        console.log('prevented!');
        if (PermissionService.isAuthenticated()) {
          // user is not allowed
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
        } else {
          // user is not logged in
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        }
      }
    }
  });
});
