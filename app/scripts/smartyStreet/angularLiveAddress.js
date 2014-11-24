'use strict';
/*jshint unused:vars,camelcase:false*/
/**
 * @ngdoc service
 * @name xcards4App.liveAddress
 * @description
 * # liveAddress
 * Constant in the xcards4App.
 */
angular.module('xcards4App')
.constant('SmartyToken', '3445594375910900087') //x-presscards, dev.x-presscards, localhost
.factory('SmartyStreetsSuggestionFactory', function (Restangular, $q, $http, SmartyToken) {
  return{
	  getSuggestions:function (suggestion) {
	    return $http.jsonp('https://autocomplete-api.smartystreets.com/suggest?callback=JSON_CALLBACK',{
	    	params:{
	    		'auth-id':SmartyToken,
		      prefix: suggestion
	    	}
	    });
  	}
  };
})
.factory('SmartyStreetsValidationFactory', function ($q,$http,SmartyToken) {
   var doValidation = function (address) {
    return $http.jsonp('https://api.smartystreets.com/street-address?callback=JSON_CALLBACK',{
        params:{
        	'auth-token':SmartyToken,
          street: address
        }
      }
    );
  };
  var componentValidation=function(address){
  	LiveAddress.components('7584 big canyon anaheim, ca', function(comp) {
  	 console.log(comp);
  	});
  	return $http.get('https://api.smartystreets.com/street-address');
  };
  return {
    doValidation: doValidation,
    componentValidation: componentValidation
  };
})
.directive('validateAddress', function(){
	return {
		restrict: 'E',
		scope: {
			address: '='
		},
		controller: 'AddressFormController',
		templateUrl: 'views/addressForm.tpl.html'
	};
})
.controller('AddressFormController', function ($scope, SmartyStreetsSuggestionFactory, SmartyStreetsValidationFactory) {
  $scope.disable=false;
  //$scope.suggestions = [];
  $scope.validated=false;
  //$scope.blurred=false;
  $scope.notValidated=false;
  //$scope.suggestSelected=0;
  $scope.addressInput='';
  if(typeof $scope.address!=='undefined'){
    if($scope.address===null){
      $scope.addressInput='';
      $scope.address={};
    }else
    if(typeof $scope.address.address!=='undefined'){
      $scope.addressInput=$scope.address.address;
    }
  }
  
  $scope.$on('event:form_submitted',function(){
    console.log($scope.validated);
    if($scope.validated){
      $scope.$emit('event:address_valid');
    }else if($scope.addressInput.length < 10){
      $scope.$emit('event:address_invalid');
    }else{
      $scope.validateAddress();
    }
  });
  $scope.valid=$scope.validated;
  // $scope.toggleBlur=function(bool){
  //   $scope.blurred=bool;
  // }
  // $scope.showSuggestions=function(){
  //   return !($scope.validated || $scope.notValidated || $scope.blurred);
  // }
  $scope.getSuggestions=function(searchString){
    return SmartyStreetsSuggestionFactory.getSuggestions(searchString)
      .then(function (result) {
        //return ['asdf','asfd','asdf'];
        if(result.data.suggestions !==null){
          if (result.data.suggestions.length === 1 && !$scope.notValidated) {
            $scope.addressInput = result.data.suggestions[0].text;
            $scope.validateAddress();
          }
          var texts=result.data.suggestions.map(function(item){
            return item.text;
          });
          return texts;
        }else{
          return [];
        }
      });
  };
  // $scope.getAddresses = function (searchString) {
  //   if (searchString != null && searchString !== '' && searchString.length > 10 && !$scope.notValidated && !$scope.validated) {
  //     SmartyStreetsSuggestionFactory.getSuggestions(searchString)
  //       .then(function (result) {
  //       	if(result.data.suggestions !== null){
	 //          $scope.suggestions = result.data.suggestions;
	 //          if (result.data.suggestions.length === 1) {
	 //            $scope.addressInput = result.data.suggestions[0].text;
  //             $scope.validateAddress();
	 //          } else {
	 //            //$scope.suggestions=result.suggestions;
	 //          }
  //       	}
  //       });
  //   }
  // };

  // $scope.$on('$typeahead.select', function (event, address, index) {
  //   console.log('typeahead selected');
  //     $scope.addressInput = $scope.suggestions[index];
  // });
  $scope.selectSuggestion=function(address){
    $scope.addressInput=address;
    $scope.validateAddress();
  };
  $scope.reEdit=function(){
    console.log('click');
    if($scope.disable){
      $scope.disable=false;
      $scope.validated=false;
      $scope.notValidated=true;
    }
  };
  // $scope.selectDown=function(event){
  //   console.log($scope.suggestSelected);
  //   if($scope.suggestions.length>0){
  //     if(event.which===40){
  //       if($scope.suggestSelected>=$scope.suggestions.length-1){
  //         $scope.suggestSelected=0;
  //       }
  //       $scope.suggestSelected++;
  //     }
  //     if(event.which===38){
  //       if($scope.suggestSelected<=0){
  //         $scope.suggestSelected=$scope.suggestions.length;
  //       }
  //       $scope.suggestSelected--;
  //     }
  //     if(event.which===13 && $scope.suggestSelected>=0 && $scope.suggestSelected < $scope.suggestions.length){
  //       $scope.addressInput=$scope.suggestions[$scope.suggestSelected].text;
  //       $scope.validateAddress();
  //     }
  //   }
  // };
  $scope.validateAddress = function () {
    $scope.disable=true;
    return SmartyStreetsValidationFactory.doValidation($scope.addressInput).then(function (result) {
        if (angular.isArray(result.data) && result.data.length > 0) {
          $scope.validated=true;
          $scope.notValidated=false;
          $scope.$emit('event:address_valid');
          //HANDLE AMBIGUIOUS RESULTS - consider angular-strap model
          $scope.address.address =$scope.addressInput = result.data[0].delivery_line_1+' '+result.data[0].last_line;
          $scope.address.deliveryLine1 = result.data[0].delivery_line_1;
          $scope.address.lastLine=result.data[0].last_line;
          $scope.address.cityName = result.data[0].components.city_name;
          $scope.address.stateAbbreviation = result.data[0].components.state_abbreviation;
          $scope.address.zipCode = result.data[0].components.zipcode;
          $scope.address.plus4Code= result.data[0].components.plus4_code;
        }else{
          $scope.$emit('event:address_invalid');
          $scope.disable=false;
          $scope.validated=false;
          $scope.notValidated=true;
        }
    }, function (error) {
        console.log('got an error in validation');
    });
	};

  // $scope.$watch('address', function (newValue, oldValue) {
  //     if (newValue !== oldValue) {
  //         $scope.validateAddress();
  //     }
  // }, true);
});

