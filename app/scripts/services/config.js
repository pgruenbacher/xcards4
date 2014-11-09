'use strict';

/**
 * @ngdoc service
 * @name xcards4App.config
 * @description
 * # config
 * Constant in the xcards4App.
 */
angular.module('xcards4App')
.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})
.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  editor: 'editor',
  guest: 'guest'
})
.constant('LOADING_EVENTS',{
  showLoading:'showLoading',
  hideLoading:'hideLoading'
})
.constant('API',{
	'domain':'http://paulgruenbacher.com/xcards2/api'
})
.config(function(RestangularProvider,API){
  RestangularProvider.setBaseUrl(API.domain);
  //RestangularProvider.setDefaultHttpFields({cache: true});
});