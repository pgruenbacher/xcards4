'use strict';

/**
 * @ngdoc directive
 * @name xcards4App.directive:socialShare
 * @description
 * # socialShare
 */
angular.module('xcards4App')
.directive('socialShare', function ($timeout,Facebook,Session,UserService,PermissionService) {
  return {
    templateUrl:'views/partials/socialshare.html',
    restrict: 'E',
    scope:{
      time:'='
    },
    link: function postLink(scope, element, attrs) {
    	scope.notRegistered=false;
    	scope.shared=false;
    	if(Session.user.shared==='1'){
    		scope.alreadyShared=true;
    	}else{
    		scope.alreadyShared=false;
    	}
    	scope.message2='';
    	if(PermissionService.isGuest()){
    		scope.message1='register and facebook share for a free card.';
    	}else{
    		scope.message1='facebook share to get a free card.';
    	}
    	scope.facebookShare=function(){
            console.log(PermissionService.isGuest());
    		if(PermissionService.isGuest()){
    			scope.message2='you haven\'t registered yet...';
    		}else{
	    		Facebook.ui({
			     method: 'share_open_graph',
			     action_type: 'og.likes',
			     action_properties: JSON.stringify({
			      object:'http://x-presscards.com',
			     })
			    }, function(response){
    				if(typeof response.error_message==='undefined'){
    					UserService.shared(true).then(function(response){
    						Session.user.credits=response.credits;
    						Session.saveUser(Session.user);
    						scope.message2='';
    						scope.shared=true;
    						scope.message1='Thank you for sharing, a credit has been added to your account';
    						$timeout(function(){
    							scope.alreadyShared=true;
    						},2000);
    					});
    				}
			    });
    		}
    	};

    	scope.countdown=180;
		  function countdown() {
		    if (scope.countdown === 1) {
		    	scope.countdown='no more';
		      return;
		    }
		    scope.countdown=scope.countdown-1;
		    $timeout(countdown, 1000);
		  }
		 
		  countdown();
    }
	};
});