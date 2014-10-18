'use strict';

/**
 * @ngdoc service
 * @name xcards4App.liveAddress
 * @description
 * # liveAddress
 * Constant in the xcards4App.
 */
angular.module('xcards4App')
.constant('SmartyToken', '3445594375398796739')
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
          street: address.text
        }
      }
    );
  };
  var componentValidation=function(address){
  	LiveAddress.components('7584 big canyon anaheim, ca', function(comp) {
  	 console.log(comp);
  	});
  	return $http.get('https://api.smartystreets.com/street-address')
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
		templateUrl: '/views/addressForm.tpl.html'
	};
})
.controller('AddressFormController', function ($scope, SmartyStreetsSuggestionFactory, SmartyStreetsValidationFactory) {
  $scope.address = {};
  $scope.addresses = [];
  $scope.getAddresses = function (searchString) {
    if (searchString != null && searchString !== '' && searchString.length > 10) {
      SmartyStreetsSuggestionFactory.getSuggestions(searchString)
        .then(function (result) {
        	if(result.data.suggestions !== null){
	          $scope.addresses = result.data.suggestions;
	          if (result.data.suggestions.length === 1) {
	            $scope.address = result.data.suggestions[0];
              $scope.validateAddress();
	          } else {
	            //$scope.addresses=result.suggestions;
	          }
        	}
        });
    }
  };

  $scope.$on('$typeahead.select', function (event, address, index) {
      $scope.address = $scope.addresses[index];
  });

  $scope.validateAddress = function () {
    return SmartyStreetsValidationFactory.doValidation($scope.address).then(function (result) {
        if (angular.isArray(result) && result.length > 0) {
          console.log('validate',result);
          //HANDLE AMBIGUIOUS RESULTS - consider angular-strap model
          //$scope.addressSearchResult = result[0].delivery_line_1;
          $scope.address.street_line = result[0].delivery_line_1;
          $scope.address.city = result[0].components.city_name;
          $scope.address.state = result[0].components.state_abbreviation;
          $scope.address.zipCode = result[0].components.zipcode + '-' + result[0].components.plus4_code;
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

