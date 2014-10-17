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
    return $http.get('https://api.smartystreets.com/street-address',
      {
      	'auth-id':SmartyToken,
      	callback:'JSON_CALLBACK',
        street: address.street_line,
        street2: address.addressLine2,
        city: address.city,
        state: address.state,
        zipcode: address.zipCode
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
  $scope.trials=[{"text":"1866 Harrowgate Dr, Columbus OH","street_line":"1866 Harrowgate Dr","city":"Columbus","state":"OH"},{"text":"1866 Harrowgate Cir, Burke VA","street_line":"1866 Harrowgate Cir","city":"Burke","state":"VA"},{"text":"1866 Harrowgate Dr, Camden NJ","street_line":"1866 Harrowgate Dr","city":"Camden","state":"NJ"},{"text":"1866 Harrowgate Dr, Carmel IN","street_line":"1866 Harrowgate Dr","city":"Carmel","state":"IN"},{"text":"1866 Harrowgate Rd, Chester VA","street_line":"1866 Harrowgate Rd","city":"Chester","state":"VA"},{"text":"1866 Harrowgate Dr, Audubon NJ","street_line":"1866 Harrowgate Dr","city":"Audubon","state":"NJ"},{"text":"1866 Harrowgate Dr, Cherry Hill NJ","street_line":"1866 Harrowgate Dr","city":"Cherry Hill","state":"NJ"},{"text":"1866 Harrowgate Dr, Collingswood NJ","street_line":"1866 Harrowgate Dr","city":"Collingswood","state":"NJ"},{"text":"1866 Harrowgate Commons, Massena NY","street_line":"1866 Harrowgate Commons","city":"Massena","state":"NY"},{"text":"1866 Harrowgate Rd, Colonial Heights VA","street_line":"1866 Harrowgate Rd","city":"Colonial Heights","state":"VA"}];
  $scope.getAddresses = function (searchString) {
    if (searchString != null && searchString !== '' && searchString.length > 10) {
      SmartyStreetsSuggestionFactory.getSuggestions(searchString)
        .then(function (result) {
        	if(result.data.suggestions !== null){
	          $scope.addresses = result.data.suggestions;
	          if (result.data.suggestions.length === 1) {
	            $scope.address = result.data.suggestions[0];
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

