'use strict';
/*jshint unused:vars*/
angular.module('xcards4App')
.filter('moment', function() {
    return function(dateString, format) {
        return moment(dateString).format(format);
    };
})
.filter('removeTableTags',function(){
    return function(htmlString){
        var ALLOWED_TAGS = ['TABLE', 'TBODY', 'TR', 'TD'];

        var sanitize=function(el) {
            // "Remove all tags from element `el' that aren't in the ALLOWED_TAGS list."
            var tags = Array.prototype.slice.apply(el.getElementsByTagName("*"), [0]);
            for (var i = 0; i < tags.length; i++) {
                if (ALLOWED_TAGS.indexOf(tags[i].nodeName) !== -1) {
                    usurp(tags[i]);
                }
            }
        };
        var usurp=function(p) {
            // "Replace parent `p' with its children.";
            var last = p;
            for (var i = p.childNodes.length - 1; i >= 0; i--) {
                var e = p.removeChild(p.childNodes[i]);
                p.parentNode.insertBefore(e, last);
                last = e;
            }
            p.parentNode.removeChild(p);
        };
        var div = document.createElement("div");
        div.innerHTML = htmlString;
        sanitize(div);
        return div.innerHTML;
    };
})
.filter('validPhoneNumber',function(){
    return function(number){
        var phoneRegex=/^(?:\([2-9]\d{2}\)\ ?|[2-9]\d{2}(?:\-?|\ ?))[2-9]\d{2}[- ]?\d{4}$/;
        return phoneRegex.test(number);
    };
})
.filter('validEmail',function(){
    return function(email){
        var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(email);
    };
})
.filter('byId',function(){
  return function(items){
    var result=[];
    for(var i=0; i<items.length; i++){
      if(items[i].id){
        result.push(items[i].id);
      }
    }
    return result;
  };
})
.filter('tel', function () {
    return function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return tel;
        }

        if (country === 1) {
            country = '';
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (country + ' (' + city + ') ' + number).trim();
    };
});