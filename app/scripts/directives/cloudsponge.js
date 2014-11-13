'use strict';

/**
 * @ngdoc directive
 * @name xcards4App.directive:cloudSponge
 * @description
 * # cloudSponge
 */
angular.module('xcards4App')
  .directive('cloudSponge', function (RequestService,$modal,$location) {
    return {
      templateUrl:'views/partials/cloudsponge.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.contacts=[];
        scope.manualForm={};
        scope.hideInput=true;
        var cskey;
        console.log($location.host());
        if($location.host()==='localhost'){
          cskey='A5CR8EQX5U8GQATHZGFE';
        }else if($location.host()==='paulgruenbacher.com'){
          //paulgruenbacher.com
          cskey='DD48P5NJKWBRV3YHF35U';
        }else{
          cskey='PG83EXRJENJM58FRZ4UC';
        }
        var check=function(){
          if(scope.contacts.length===0){return;}
          var submission=[],number;
          for(var i=0; i<scope.contacts.length; i++){
            number=null;
            if(scope.contacts[i].reviewed){
              continue;
            }else{
              scope.contacts[i].reviewed=true;
            }
            if(typeof scope.contacts[i].phone[0] !=='undefined'){
              number=scope.contacts[i].phone[0].number;
            }
            submission.push({
              email: scope.contacts[i].selectedEmail(),
              number: number,
              name: scope.contacts[i].fullName()
            });
          } 
          RequestService.check(submission).then(function(response){
            console.log(response);
            if(response.status!=='success'){return;}
            if(response.existing.length>0){
              var checkExisting=$modal.open({
                templateUrl:'views/partials/existingModal.html',
                size:'sm',
                windowClass:'expanded-width',
                controller:'ExistingCtrl',
                resolve:{
                  exists:function(){return response.existing;}
                }
              });
              checkExisting.result.then(function(chosen){
                for(var i=0; i<chosen.length; i++){
                  if(chosen[i].selected>=0){
                    scope.contacts[chosen[i].id].highlight=true;
                    scope.contacts[chosen[i].id].address=[{
                      formatted:chosen[i].addresses[chosen[i].selected].address,
                      addressId:chosen[i].addresses[chosen[i].selected].id
                    }];
                  }
                }
              },function(){
                console.log('dismissed');
              });
            }
          });
        };
        var contactsSubmitted=function(contacts,source,owner){
          console.log(contacts,source,owner);
          scope.contacts=scope.contacts.concat(contacts);
          console.log(scope.contacts);
          scope.$apply();
          check();
        };
        var csPageOptions = {
            domain_key:cskey,
            include:['name','email','mailing_address'],
            // set skipSourceMenu to true when using deep links for a more consistent UX
            skipSourceMenu:true, // suppresses the source menu unless linked to directly
            // delay making the links that launch a popup clickable
            // until after the widget has initialized completly. a popup window must
            // be opened in an onclick handler, so we don't support queueing these actions
            selectionLimit:30,
            afterSubmitContacts:contactsSubmitted
        };
        cloudsponge.init(csPageOptions);
      	scope.launch=function(arg){
      		cloudsponge.launch(arg);
      	};
        scope.createManually=function(){
          scope.hideInput=false;
        };
        scope.submitManually=function(a){
          var arrayObj={
            name:a.name,
            email:[{address:a.email}],
            fullName:function(){return this.name;},
            phone:[{number:a.number}],
            selectedEmail:function(){return this.email[0].address;}
          };
          scope.contacts=scope.contacts.concat(arrayObj);
          scope.manualForm={};
          check();
        };
        scope.submitForm=function(contacts){
          console.log('submit',contacts);
          if(contacts.length===0){return;}
          var submission=[],number,address,addressId;
          for(var i=0; i<contacts.length; i++){
            number=null;
            if(typeof contacts[i].phone[0] !=='undefined'){
              number=contacts[i].phone[0].number;
            }
            addressId=null;
            address=null;
            if(typeof contacts[i].address!=='undefined'){
              address=contacts[i].address[0].formatted;
              addressId=contacts[i].address[0].addressId || -1
            }
            submission.push({
              email: contacts[i].selectedEmail(),
              number: number,
              name: contacts[i].fullName(),
              addressId: addressId,
              address:address
            });
          }
          RequestService.request(submission).then(function(response){
            console.log(response);
          });
        };
      }
    };
  });
