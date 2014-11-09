'use strict';
/*jshint unused:vars, camelcase:false*/
/**
 * @ngdoc function
 * @name xcards4App.controller:ExistingCtrl
 * @description
 * # ExistingCtrl
 * Controller of the xcards4App
 */
angular.module('xcards4App')
  .controller('ExistingCtrl', function (exists,$scope,Session,CardService,$q,$state,$modalInstance) {
    var obj, array=[];
    function already(index,value){
        for(var i=0; i<array.length; i++){
            if(array[i][index]===value){
                return i+1;
            }
        }
        return false;
    }
    for(var i=0; i<exists.length; i++){
        if(!already('email',exists[i].email)||!already('number',exists[i].number)){
            console.log('no already');
            obj={
                email:exists[i].email,
                number:exists[i].number,
                id:i,
                selected:-1,
                addresses:[{address:exists[i].address,id:exists[i].id}]
            };
            array.push(obj);
        }else{
            console.log('alraeady');
            var index=already('email',exists[i].email)||already('number',exists[i].number);
            console.log(index-1);
            array[index-1].addresses.push({address:exists[i].address,id:exists[i].id});
        }
    }
    console.log(array);
    $scope.exists=array;
    $scope.choose=function(chosen){
        console.log(chosen);
        $modalInstance.close(chosen);
    };
  });
