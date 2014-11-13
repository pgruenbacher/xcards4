'use strict';
/*jshint unused:vars*/
/**
 * @ngdoc function
 * @name xcards4App.controller:SurveymodalCtrl
 * @description
 * # SurveymodalCtrl
 * Controller of the xcards4App
 */
angular.module('xcards4App')
  .controller('SurveyModalCtrl', function ($scope,Session,$modalInstance) {
    $scope.survey=Session.survey;
    $scope.finish=function(survey){
    	$modalInstance.close(survey);
    };
  });
