'use strict';
/*jshint unused:vars, camelcase:false*/
/**
 * @ngdoc function
 * @name xcards4App.controller:LoginctrlCtrl
 * @description
 * # LoginctrlCtrl
 * Controller of the xcards4App
 */
angular.module('xcards4App')
/*Login Controller */
.controller('LoginCtrl', function($scope,help, mode, $http, $stateParams,$modalInstance, $state, AuthenticationService, UserService, localStorageService) {
  $scope.message = '';
  // Define user empty data :/
  $scope.user = {};
  $scope.change={};
  $scope.data={
  	register:mode,
  };
  $scope.loginLoading=false;
  // Defining user logged status
  $scope.logged = false;
  $scope.login = function(user) {
    $scope.loginLoading=true;
    AuthenticationService.login(user).then(function(){
      $scope.loginLoading=false;
    },function(){
      $scope.loginLoading=false;
    });
  };
  $scope.forgotPassword=function(email){
    $scope.loginLoading=true;
    AuthenticationService.forgotPassword(email).then(function(response){
      $scope.loginLoading=false;
      help('forgotPassword');
      $scope.closeModal();
    },function(){
      $scope.loginLoading=false;
    });
  };
  $scope.registerAccount=function(user){
    $scope.loginLoading=true;
  	UserService.create(user).then(function(response){
      $scope.loginLoading=false;
      console.log('registered',response.status);
  		if(response.status==='success'){
        $scope.closeModal();
        $scope.message='Thank you for registering you account. Check your email to activate';
        help('accountRegistered');
      }else if(response.status==='validation'){
        console.log(response);
      }
  	},function(){
      $scope.loginLoading=false;
    });
  };
  $scope.changePassword=function(){
    $scope.loginLoading=true;
    UserService.changePassword($scope.change).then(function(response){
      $scope.loginLoading=false;
      $scope.closeModal();
      console.log(response);
    },function(){
      $scope.loginLoading=false;
    });
  };
  $scope.closeModal=function(){
    console.log('close modal');
    $modalInstance.close();
  };
  // $scope.facebook = function() {
  //   Facebook.getLoginStatus(function(response) {
  //     if (response.status === 'connected') {
  //       $scope.logged = true;
  //       $scope.fbLoginUser();
  //     }
  //     else{
  //       $scope.fbLogin();
  //     }
  //   },true);
  // };
  // //Include permissions object as second parameter
  // $scope.fbLogin = function() {
  //   Facebook.login(function(response) {
  //     if (response.status === 'connected') {
  //       $scope.logged = true;
  //       $scope.fbLoginUser();
  //     }
  //   },PERMISSIONS.FbPermissions);
  // };
  // $scope.fbLoginUser= function(){
  //   FacebookService.me().then(function(response){
  //     var user=response;
  //     console.log('user',user);
  //     user.facebook_id=user.id;
  //     user.password='verified';
  //     AuthenticationService.saveAuthentication(user);
  //     AuthenticationService.login(user);
  //   });
  // };
  $scope.data.toggleModal= function(mode){
    $scope.data.register =mode;
  };
  $scope.$on('event:auth-loginConfirmed', function() {
    $scope.email = null;
    $scope.password = null;
    $scope.closeModal();
  });
  $scope.$on('event:auth-login-failed', function(e, status) {
    var error = 'Login failed';
    console.log(status);
    if (status === 400){
      error = 'Invalid email or Password. Did you activate the account? Check email';
    }
    $scope.message = error;
  });
});