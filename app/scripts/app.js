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
    'http-auth-interceptor'
  ])
.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('main',{
  	url:'',
    abstract:true,
    templateUrl:'views/main.html',
    controller:'MainCtrl',
    resolve:{
      user:function(AuthenticationService){
        return AuthenticationService.checkAuthentication().then(function(r){
          console.log('resolved');
          return r.user;
        });
      }
    }
  })
  .state('main.front',{
    url:'/front',
    templateUrl:'views/front.html'
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
});
// .config(function ($httpProvider) {
//   $httpProvider.interceptors.push([
//     '$injector',
//     function ($injector) {
//       return $injector.get('AuthInterceptor');
//     }
//   ]);
// })
// .run(function ($rootScope, AUTH_EVENTS, authService) {
//   $rootScope.$on('$stateChangeStart', function (event, next) {
//     var authorizedRoles = next.data.authorizedRoles;
//     if (!AuthService.isAuthorized(authorizedRoles)) {
//       event.preventDefault();
//       if (AuthService.isAuthenticated()) {
//         // user is not allowed
//         $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
//       } else {
//         // user is not logged in
//         $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
//       }
//     }
//   });
// });
