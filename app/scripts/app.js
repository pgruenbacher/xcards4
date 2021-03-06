'use strict';
/*jshint unused:vars*/
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
    'angularFileUpload',
    'ui.brushes',
    'angularPayments',
    'angulartics',
    'angulartics.google.analytics',
    'facebook',
    'colorpicker.module'
  ])
.config(function ($stateProvider,$locationProvider,$urlRouterProvider) {
  // enable html5Mode for pushstate ('#'-less URLs)
  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('!');
  $stateProvider
  .state('app',{
    abstract:true,
    controller:'AppCtrl',
    templateUrl:'views/app.html'
  })
  .state('main',{
    parent:'app',
    abstract:true,
    templateUrl:'views/main.html',
    controller:'MainCtrl',
    resolve:{
      user:function(AuthenticationService,Session,GuestService,Facebook){
        //$scope.globalLoading=true;
        
        return AuthenticationService.checkAuthentication().then(function(r){
          //$scope.globalLoading=false;
          if(r.valid){
            Session.create(r.user);
            return {user:r.user};
          }else{
            console.log('not valid');
            GuestService.login(r.user,r.password).then(function(r){
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
    url:'/front?action&status',
    templateUrl:'views/front.html',
    controller:'FrontCtrl'
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
    controller:'UploadCtrl',
    data:{
      ignoreLoading:true
    },
    resolve:{
      card:function(CardService){
        console.log('resolve');
        return CardService.check();
      }
    }
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
  .state('main.recipients',{
    url:'/recipients',
    templateUrl:'views/recipients.html',
    controller:'RecipientsCtrl'
  })
  .state('main.preview',{
    url:'/preview',
    templateUrl:'views/preview.html',
    controller:'PreviewCtrl',
    resolve:{
      card:function(CardService,Session){
        return CardService.get(Session.card.id).then(function(response){
          console.log('resolved card',response.card);
          Session.saveCard(response.card);
          return response.card;
        });
      },
      user:function(AuthenticationService,Session){
      //$scope.globalLoading=true;
        return AuthenticationService.checkAuthentication().then(function(r){
          //$scope.globalLoading=false;
          Session.create(r.user);
          return {user:r.user};
        });
      },
      pricings:function(Restangular){
        return Restangular.all('pricings').getList().then(function(response){
          console.log('pricings',response);
          return response;
        });
      }
    }
  })
  .state('main.addressBook',{
    url:'/addressBook',
    templateUrl:'views/addressBook.html'
  })
  .state('account',{
    parent:'main',
    abstract:true,
    templateUrl:'views/account.html'
  })
  .state('account.main',{
    url:'/account',
    controller:'AccountCtrl',
    templateUrl:'views/account/main.html'
  })
  .state('account.cards',{
    url:'/cards',
    controller:'CardsCtrl',
    templateUrl:'views/account/cards.html'
  })
  .state('account.market',{
    url:'/market',
    controller:'MarketCtrl',
    templateUrl:'views/account/market.html'
  })
  .state('account.contact',{
    url:'/contact',
    controller:'ContactCtrl',
    templateUrl:'views/about/contact.html'
  })
  .state('account.privacy',{
    url:'/privacy',
    templateUrl:'views/about/privacy.html'
  })
  .state('account.terms',{
    url:'/terms',
    templateUrl:'views/about/terms.html'
  })
  .state('account.faq',{
    url:'/faq',
    templateUrl:'views/about/faq.html'
  })
  .state('account.share',{
    url:'/share',
    templateUrl:'views/account/share.html',
    controller:'ShareCtrl'
  })
  .state('account.company',{
    url:'/company',
    templateUrl:'views/about/company.html'
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
.run(function ($rootScope, AUTH_EVENTS, PermissionService, LOADING_EVENTS) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if(typeof toState.data !=='undefined'){
      if(toState.data.ignoreLoading){
        return;
      }
    }
    if (toState.resolve) {
      $rootScope.$broadcast(LOADING_EVENTS.showLoading);
    }
  });
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if (toState.resolve) {
      $rootScope.$broadcast(LOADING_EVENTS.hideLoading);
    }
  });
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams) {
    if (toState.resolve) {
      $rootScope.$broadcast(LOADING_EVENTS.hideLoading);
    }
  });
  $rootScope.$on('$stateChangeStart', function (event, next) {
    if(typeof next.data !== 'undefined'){
      if(typeof next.data.authorizedRoles==='undefined'){return;}
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
