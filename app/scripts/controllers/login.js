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
.controller('LoginCtrl', function($scope,help, mode, $http, Session, $stateParams,Facebook,$modalInstance, $state, AuthenticationService, UserService, localStorageService) {
  $scope.message = '';
  // Define user empty data :/
  $scope.user = {};
  $scope.change={};
  $scope.data={
  	register:mode,
  };
  $scope.errors={};
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
  $scope.loginFacebook=function(){
    $scope.loginLoading=true;
    Facebook.login(function(response){
      console.log(response);
      Session.saveFacebook(response);
      if(response.status==='connected'){
        AuthenticationService.login({email:response.authResponse.userID,password:response.authResponse.accessToken}).then(function(response){
          $scope.loginLoading=false;
        },function(){
          $scope.loginLoading=false;
        });
      }
    },{
      scope:'email'
    });

  };
  $scope.setPassword=function(user){
    AuthenticationService.login(user).then(function(){
      $scope.loginLoading=false;
    },function(){
      $scope.loginLoading=false;
    });
  };
  $scope.forgotPassword=function(email){
    $scope.loginLoading=true;
    AuthenticationService.forgotPassword(email).then(function(response){
      if(response.status==='success'){
        $scope.loginLoading=false;
        help('forgotPassword');
        $scope.closeModal();
      }else{
        $scope.message='That email could not be found, have you activated your account?';
        $scope.loginLoading=false;
      }
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
        if(typeof response.errors !=='undefined'){
          $scope.errors.email=angular.fromJson(response.errors).email;
          console.log(angular.fromJson(response.errors));
          console.log($scope.errors);
        }
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
    $scope.message='';
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