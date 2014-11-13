'use strict';
/*jshint unused:vars*/
/**
 * @ngdoc service
 * @name xcards4App.SurveyServic
 * @description
 * # SurveyService
 * Service in the xcards4App.
 */
angular.module('xcards4App')
.factory('SurveyService', function survey($modal,Restangular,Session) {
	// AngularJS will instantiate a singleton by calling "new" on this function
	return{
		open:function(){
			if(typeof Session.survey !=='undefined'){
				if(Session.survey.finished){
					return;
				}
			}
			var self=this;
			var modal=$modal.open({
	   			templateUrl:'views/partials/surveyModal.html',
	   			size:'sm',
	   			controller:'SurveyModalCtrl'
	   		});
	   		modal.result.then(function(result){
	   			Session.saveSurvey(result);
	   			console.log(result);
	   			self.submit(result);
	   		},function(reason){
	   			console.log('dismissed',reason);
	   		});
		},
		submit:function(data){
			return Restangular.all('surveys').post(data);
		}
	};
});
