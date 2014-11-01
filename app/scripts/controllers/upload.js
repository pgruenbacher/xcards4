'use strict';
/*jshint unused:vars*/
/**
 * @ngdoc function
 * @name xcards4App.controller:CardCtrl
 * @description
 * # CardCtrl
 * Controller of the xcards4App
 */
angular.module('xcards4App')
.controller('UploadCtrl', function ($scope,FileUploader,API,PermissionService,AuthenticationService,$http,$state,Session,CardService,card) {
	$scope.uploadStatus=null;
	$scope.loading=false;
	console.log(card);
	var cardId=card.id;
	var route='/cards/'+card.id+'/images';
	var accessToken=AuthenticationService.getAccessToken();
	var ImageUploader=$scope.ImageUploader= new FileUploader({
		url: API.domain+route,
		headers: {Authorization: accessToken},
		queueLimit:1,
		alias:'image'
	});
	ImageUploader.filters.push({
		name: 'imageFilter',
		fn: function(item /*{File|FileLikeObject}*/, options) {
			var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
			return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
		}
	});
	ImageUploader.onAfterAddingFile = function(fileItem) {
		$scope.loading=true;
		fileItem.upload();
	};
	ImageUploader.onErrorItem=function(item,response,status,headers){
		$scope.loading=false;
	};
	ImageUploader.onSuccessItem=function(item, response, status, headers){
		$scope.loading=false;
		var card=Session.card;
		card.original=response.image;
		Session.saveCard(card);
		$scope.uploadComplete=true;
	};
	$scope.continue=function(){
		$state.go('main.crop');
	};
});
