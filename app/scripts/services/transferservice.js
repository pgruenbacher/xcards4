'use strict';
/*jshint unused:vars, camelcase:false*/
/**
 * @ngdoc service
 * @name xcards4App.TransferService
 * @description
 * # TransferService
 * Service in the xcards4App.
 */
angular.module('xcards4App')
  .factory('TransferService', function(Restangular,Session,$modal,validPhoneNumberFilter,validEmailFilter) {
  	var confirmationModals=[];
    return{
    	verifyRecipient:function(recipient){
	      var valid =false;
	      if(validEmailFilter(recipient.email)){
	      	valid++;
	      }else{
	      	recipient.email='';
	      }
	      if(validPhoneNumberFilter(recipient.number)){
	      	valid++;
	      }else{
	      	recipient.number='';
	      }
	      return {status:true,recipient:recipient};
	    },
	    create:function(transfer){
	    	return Restangular.all('transfers').post(transfer);
	    },
	    accept:function(id){
	    	return Restangular.one('transfers',id).get({accept:true});
	    },
	    reject:function(id){
	    	return Restangular.one('transfers',id).get({accept:false});
	    },
	    checkAndPrompt:function(){
	    	if(typeof Session.user ==='undefined'&&Session.user===null){
	    		return;
	    	}
	    	var transfers=Session.user.incoming_transfers;
	    	var self=this;
	    	var prompt=function(i){
 				if(transfers[i].reverted==='1'||transfers[i].confirmed==='1'){
 					return;
 				}
	    		Restangular.one('users',transfers[i].sender_id).get().then(function(response){
	    			if(response.status==='success'){
	    				confirmationModals[i]=$modal.open({
				    		templateUrl:'views/partials/creditsConfirmation.html',
				    		size:'sm',
				    		controller:'CreditsConfirmationCtrl', //see bottom
				    		resolve:{
				    			sender:function(){
				    				return response.user;
				    			},
				    			transfer:function(){
				    				return transfers[i];
				    			}
				    		}
				    	});
				    	confirmationModals[i].result.then(function(result){
				    		if(result){
				    			self.accept(transfers[i].id).then(function(response){
				    				var user=Session.user;
				    				user.credits=response.credits;
				    				Session.saveUser(user);
				    			});
				    		}else{
				    			self.reject(transfers[i].id);
				    		}
				    	});
	    			}
	    		});
	    	};
	    	for(var i=0; i<transfers.length; i++){
	    		prompt(i);
	    	}	
	    }
    };
  })
.controller('CreditsConfirmationCtrl',function($scope,sender,transfer){
	$scope.sender=sender;
	$scope.transfer=transfer;
});
