'use strict';
/*jshint unused:vars*/
/**
 * @ngdoc function
 * @name xcards4App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the xcards4App
 */
angular.module('xcards4App')
.controller('AppCtrl',function($scope,HelpService,SurveyService,LOADING_EVENTS){
  $scope.message={};
  $scope.help=function(name,options){
    $scope.bentley=HelpService.help(name);
  };
  $scope.$on(LOADING_EVENTS.showLoading,function(){
    $scope.stateLoading=true;
  });
  $scope.$on(LOADING_EVENTS.hideLoading,function(){
    $scope.stateLoading=false;
  });
})
.controller('MainCtrl', function ($scope,$state,$modal,user,Session,UserService,TransferService,AuthenticationService,PermissionService) {
  // $scope.currentUser = null;
  // $scope.userRoles = USER_ROLES;
  // $scope.isAuthorized = authService.isAuthorized;
  // $scope.setCurrentUser = function (user) {
  //   $scope.currentUser = user;
  // };
  $scope.root={};
  $scope.root.user=user;
  $scope.checkIfAuthenticated=function(){
    return PermissionService.isAuthenticated();
  };
  $scope.checkIfAuthorized=function(arg){
    return PermissionService.isAuthorized(arg);
  };
  $scope.logout=function(){
    AuthenticationService.logout();
  };
  //Check for any transfers pending
  if(user !== null && typeof user!=='undefined'){
    TransferService.checkAndPrompt();
  }
  $scope.$on('event:auth-logout-complete', function() {
    $state.go('main.front', {}, {reload: true, inherit: false});
  });
  $scope.$on('event:auth-loginConfirmed', function() {
    $state.go('main.front', {}, {reload: true, inherit: false});
  });
  $scope.$on('event:auth-loginRequired', function(e, rejection) {
    // $scope.user=AuthenticationService.getAuthentication();
    // if($scope.user.email && $scope.user.password){
    //   AuthenticationService.login($scope.user);
    // }
    $scope.showLoginModal();
  });
  $scope.showLoginModal=function(mode){
  	$modal.open({
  		templateUrl:'views/loginModal.html',
  		controller:'LoginCtrl',
  		size:'sm',
  		resolve:{
  			mode:function(){
  				return mode;
  			},
        help:function(){
          return $scope.help;
        }
  		}
  	});
  };
});
// .controller('LoginController', function ($scope, $rootScope, AUTH_EVENTS, authService) {
// 	$scope.credentials = {
// 	  username: '',
// 	  password: ''
// 	};
// 	$scope.login = function (credentials) {
// 	  AuthService.login(credentials).then(function (user) {
// 	    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
// 	    $scope.setCurrentUser(user);
// 	  }, function () {
// 	    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
// 		});
// 	};
// });
