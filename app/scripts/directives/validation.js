'use strict';

/**
 * @ngdoc service
 * @name xcards4App.liveAddress
 * @description
 * # liveAddress
 * Constant in the xcards4App.
 */
angular.module('xcards4App')
.directive('passwordMatch',[function(){
  return {
    restrict: 'A',
    scope:true,
    require: 'ngModel',
    link: function (scope, elem , attrs,control) {
      var checker = function () {
        //get the value of the first password
        var e1 = scope.$eval(attrs.ngModel);

        //get the value of the other password 
        var e2 = scope.$eval(attrs.passwordMatch);
        return e1 === e2;
      };
      scope.$watch(checker, function (n) {
        //set the form control to valid if both
        //passwords are the same, else invalid
        control.$setValidity('match', n);
      });
    }
  };
}])
.directive('onValidSubmit',function($parse, $timeout) {
  return {
    require: '^form',
    restrict: 'A',
    link: function(scope, element, attrs, form) {
      form.$submitted = false;
      var fn = $parse(attrs.onValidSubmit);
      element.on('submit', function(event) {
        $timeout(function(){
          scope.$apply(function() {
            element.addClass('ng-submitted');
            form.$submitted = true;
            $timeout(function(){
              if (form.$valid && !form.$invalid) {
                if (typeof fn === 'function') {
                  fn(scope, {$event: event});
                }
              }
            },100); //100 ms delay to allow for other validator functions
          });
        },100); //100 ms delay for other $apply occurring
      });
    }
  };
})
.directive('validated', function($parse) {
  return {
    restrict: 'C',
    require: '^form',
    /*jshint loopfunc: true */
    link: function(scope, element, attrs, form) {
      var inputs = element.find('*');
      for(var i = 0; i < inputs.length; i++) {
        (function(input){
          var attributes = input.attributes;
          if (attributes.getNamedItem('ng-model') !== null && attributes.getNamedItem('name') !== null) {
            var field = form[attributes.name.value];
            if (field !== void 0) {
              scope.$watch(function() {
                return form.$submitted + '_' + field.$valid;
              }, function() {
                if (form.$submitted !== true){
                  return null;
                }
                var inp = angular.element(input);
                if (inp.hasClass('ng-invalid')) {
                  element.removeClass('has-success');
                  element.addClass('has-error');
                } else {
                  element.removeClass('has-error').addClass('has-success');
                }
              });
            }
          }
        })(inputs[i]);
      }
    }
  };
});