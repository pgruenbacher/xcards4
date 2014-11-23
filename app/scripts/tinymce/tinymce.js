/**
 * Binds a TinyMCE widget to <textarea> elements.
 */
angular.module('ui.tinymce', [])
  .value('uiTinymceConfig', {

  })
  .directive("compileHtml", function($parse, $sce, $compile) {
    return {
      restrict: "A",
      scope:{
        'message':'=compileHtml'
      },
      link: function (scope, element, attributes) {
        var expression = $sce.trustAsHtml(scope.message).toString();
        element.append(expression);
        // var getResult = function () {
        //   return expression(scope);
        // };
        // scope.$watch(getResult, function (newValue) {
        //   var linker = $compile(newValue);
        //   element.append(linker(scope));
        // });
      }
    }
  })
  .directive('uiTinymce', ['uiTinymceConfig', function (uiTinymceConfig) {
    uiTinymceConfig = uiTinymceConfig || {};
    var generatedIds = 0;
    return {
      priority: 10,
      require: 'ngModel',
      link: function (scope, elm, attrs, ngModel) {
        var expression, options, tinyInstance,
          updateView = function (html) {
            ngModel.$setViewValue(html);
            if (!scope.$root.$$phase) {
              scope.$apply();
            }
          };
        // generate an ID if not present
        if (!attrs.id) {
          attrs.$set('id', 'uiTinymce' + generatedIds++);
        }

        if (attrs.uiTinymce) {
          expression = scope.$eval(attrs.uiTinymce);
        } else {
          expression = {};
        }
        options = {
          // Update model when calling setContent (such as from the source editor popup)
          setup: function (ed) {
            var args;
            ed.on('init', function(args) {
              ngModel.$render();
            });
            // Update model on button click
            ed.on('ExecCommand', function (e) {
              ed.save();
              updateView(ed.getContent({format : 'raw'}));
            });
            // Update model on keypress
            ed.on('KeyUp', function (e) {
              if(!options.inline){
                ed.save();
              }
              if(elm.context.scrollHeight>elm.context.offsetHeight &&(e.keyCode!==46)&&e.keyCode!==8){
                ed.undoManager.undo();
              }
              updateView();
            });
            ed.on('Change',function(e){
              updateView(ed.getContent({format : 'raw'})); //quick fix for fore color background color
              
            });
            // Update model on change, i.e. copy/pasted text, plugins altering content
            ed.on('SetContent', function (e) {
              if(!e.initial){
                ed.save();
                updateView(ed.getContent({format : 'raw'}));
              }
            });
            if (expression.setup) {
              scope.$eval(expression.setup);
              delete expression.setup;
            }
          },
          mode: 'exact',
          elements: attrs.id
        };
        // extend options with initial uiTinymceConfig and options from directive attribute value
        angular.extend(options, uiTinymceConfig, expression);
        setTimeout(function () {
          tinyMCE.baseURL = "bower_components/tinymce";
          tinymce.init(options);
        });


        ngModel.$render = function() {
          if (!tinyInstance) {
            tinyInstance = tinymce.get(attrs.id);
          }
          if (tinyInstance) {
            tinyInstance.setContent(ngModel.$viewValue || '');
          }
        };
      }
    };
  }]);