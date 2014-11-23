function ribbon( context,constants )
{
    this.init( context,constants );
}
ribbon.prototype =
{
    context: null,
    mouseX: null, mouseY: null,
    painters: null,
    interval: null,
    init: function( context,constants)
    {
        var scope = this;
        this.context = context;
        this.context.globalCompositeOperation = 'source-over';
        this.mouseX = constants.CANVAS_WIDTH / 2;
        this.mouseY = constants.CANVAS_HEIGHT / 2;
        this.painters = new Array();
        for (var i = 0; i < 50; i++)
        {
            this.painters.push({ dx: constants.CANVAS_WIDTH / 2, dy: constants.CANVAS_HEIGHT / 2, ax: 0, ay: 0, div: 0.1, ease: Math.random() * 0.1 + 0.5});
        }
        this.interval = setInterval( update, 1000/60 );
        function update()
        {
            var i;
            scope.context.lineWidth = constants.BRUSH_SIZE;            
            scope.context.strokeStyle = 'rgba(' + constants.COLOR[0] + ', ' + constants.COLOR[1] + ', ' + constants.COLOR[2] + ', ' + 0.05 * constants.BRUSH_PRESSURE + ')';
            for (i = 0; i < scope.painters.length; i++)
            {
                scope.context.beginPath();
                scope.context.moveTo(scope.painters[i].dx, scope.painters[i].dy);        
                scope.painters[i].dx -= scope.painters[i].ax = (scope.painters[i].ax + (scope.painters[i].dx - scope.mouseX) * scope.painters[i].div) * scope.painters[i].ease;
                scope.painters[i].dy -= scope.painters[i].ay = (scope.painters[i].ay + (scope.painters[i].dy - scope.mouseY) * scope.painters[i].div) * scope.painters[i].ease;
                scope.context.lineTo(scope.painters[i].dx, scope.painters[i].dy);
                scope.context.stroke();
            }
        }
    },
    destroy: function()
    {
        clearInterval(this.interval);
    },
    strokeStart: function( mouseX, mouseY )
    {
        this.mouseX = mouseX;
        this.mouseY = mouseY
        for (var i = 0; i < this.painters.length; i++)
        {
            this.painters[i].dx = mouseX;
            this.painters[i].dy = mouseY;
        }
        this.shouldDraw = true;
    },
    stroke: function( mouseX, mouseY )
    {
        this.mouseX = mouseX;
        this.mouseY = mouseY;
    },
    strokeEnd: function()
    {
    
    }
}
function web( context , constants ){
    this.init( context , constants);
}
web.prototype =
{
    name: "Web",
    context: null,
    prevMouseX: null, prevMouseY: null,
    points: null, count: null,
    constants: null,
    init: function( context,constants){
        this.context = context;
        this.context.globalCompositeOperation = 'source-over';
        this.points = new Array();
        this.count = 0;
        this.constants=constants;
    },
    destroy: function(){
    },

    strokeStart: function( mouseX, mouseY ){
        this.prevMouseX = mouseX;
        this.prevMouseY = mouseY;
    },

    stroke: function( mouseX, mouseY ){
        var i, dx, dy, d;

        this.points.push( [ mouseX, mouseY ] );

        this.context.lineWidth = this.constants.BRUSH_SIZE;
        this.context.strokeStyle = "rgba(" + this.constants.COLOR[0] + ", " + this.constants.COLOR[1] + ", " + this.constants.COLOR[2] + ", " + 0.5 * this.constants.BRUSH_PRESSURE + ")";
        this.context.beginPath();
        this.context.moveTo(this.prevMouseX, this.prevMouseY);
        this.context.lineTo(mouseX, mouseY);
        this.context.stroke();

        this.context.strokeStyle = "rgba(" + this.constants.COLOR[0] + ", " + this.constants.COLOR[1] + ", " + this.constants.COLOR[2] + ", " + 0.1 * this.constants.BRUSH_PRESSURE + ")";

        for (i = 0; i < this.points.length; i++)
        {
            dx = this.points[i][0] - this.points[this.count][0];
            dy = this.points[i][1] - this.points[this.count][1];
            d = dx * dx + dy * dy;

            if (d < 2500 && Math.random() > 0.9)
            {
                this.context.beginPath();
                this.context.moveTo( this.points[this.count][0], this.points[this.count][1]);
                this.context.lineTo( this.points[i][0], this.points[i][1]);
                this.context.stroke();
            }
        }
        this.prevMouseX = mouseX;
        this.prevMouseY = mouseY;

        this.count ++;
    },
    strokeEnd: function(){

    }
}
/*
main actions below
*/
angular.module('ui.brushes', [])
  .directive('canvasBrush', function () {
    return {
        scope:{
            brush:'@',
            color:'=',
            ratio:'@',
        },
        restrict:'A',
        link: function (scope, element, attrs, ngModel) {
            var BRUSHES = ['ribbon'],
            USER_AGENT = navigator.userAgent.toLowerCase();
            var CANVAS_WIDTH = element[0].clientWidth,
            BRUSH='ribbon',
            CANVAS_HEIGHT = element[0].clientHeight,
            BRUSH_SIZE = 2,
            BRUSH_PRESSURE = 1,
            COLOR = [0, 0, 0],
            BACKGROUND_COLOR = [250, 250, 250],
            brush,
            saveTimeOut,
            wacom,
            i,
            container,
            lastX,
            lastY,
            mouseX = 0,
            mouseY = 0,
            container,
            ratio=1,
            canvas,
            flattenCanvas,
            context,
            shiftKeyIsDown = false,
            altKeyIsDown = false;
            var constants={
                CANVAS_HEIGHT:CANVAS_HEIGHT,
                CANVAS_WIDTH:CANVAS_WIDTH,
                BRUSH_SIZE:BRUSH_SIZE,
                BRUSH_PRESSURE:BRUSH_PRESSURE,
                COLOR:COLOR
            };
            function init(){
                var hash, palette, embed;
                if (USER_AGENT.search('android') > -1 || USER_AGENT.search('iphone') > -1){
                    BRUSH_SIZE = 2;    
                }
                if (USER_AGENT.search('safari') > -1 && USER_AGENT.search('chrome') == -1){ // Safari
                    //STORAGE = false;
                }
                canvas=element[0];
                container=element.parent()[0];
                if(typeof scope.ratio!=='undefined'){
                    ratio=scope.ratio;
                }
                context = canvas.getContext('2d');
                if (BRUSHES.indexOf(BRUSH)!==-1){
                    brush = eval('new ' + BRUSH + '(context,constants)');
                }
                container.addEventListener('mousemove', onMouseMove, false);
                container.addEventListener('mouseout', onCanvasMouseOut, false);
                container.addEventListener('mousedown', onCanvasMouseDown, false);
                container.addEventListener('touchstart', onCanvasTouchStart, false);
                scope.$on('clear',onMenuClear);
                attrs.$observe('brush',function(value){
                    BRUSH=value;
                    onBrushChange()
                });
                scope.$watch('color',function(oldColor,newColor){
                    if(typeof newColor==='string'){
                        var rgb = newColor.replace(/[^\d,]/g, '').split(',');
                        constants.COLOR=rgb;
                        onColorChange();
                    }
                });
            }
            init();
            function onMouseMove( event ){
                if(event.offsetX!==undefined){
                    lastX = event.offsetX;
                    lastY = event.offsetY;
                } else { // Firefox compatibility
                    lastX = event.layerX - event.currentTarget.offsetLeft;
                    lastY = event.layerY - event.currentTarget.offsetTop;
                } 
                mouseX = lastX*ratio;
                mouseY = lastY*ratio;
            }
            // DOCUMENT
            function onCanvasMouseOut( event ){
                onCanvasMouseUp();
            }
            // CANVAS
            function onCanvasMouseDown( event ){
                var data, position;
                clearTimeout(saveTimeOut);
                if (altKeyIsDown)
                {
                    flatten();
                    data = flattenCanvas.getContext('2d').getImageData(0, 0, flattenCanvas.width, flattenCanvas.height).data;
                    position = (event.clientX + (event.clientY * canvas.width)) * 4;
                    return;
                }    
                 if(event.offsetX!==undefined){
                    lastX = event.offsetX;
                    lastY = event.offsetY;
                } else { // Firefox compatibility
                    lastX = event.layerX - event.currentTarget.offsetLeft;
                    lastY = event.layerY - event.currentTarget.offsetTop;
                } 
                brush.strokeStart( lastX*ratio, lastY*ratio );
                container.addEventListener('mousemove', onCanvasMouseMove, false);
                container.addEventListener('mouseup', onCanvasMouseUp, false);
            }
            function onCanvasMouseMove( event ){
                if(event.offsetX!==undefined){
                    lastX = event.offsetX;
                    lastY = event.offsetY;
                } else { // Firefox compatibility
                    lastX = event.layerX - event.currentTarget.offsetLeft;
                    lastY = event.layerY - event.currentTarget.offsetTop;
                }    
                brush.stroke( lastX*ratio, lastY*ratio );
            }
            function onCanvasMouseUp(){
                brush.strokeEnd();
                container.removeEventListener('mousemove', onCanvasMouseMove, false);
                container.removeEventListener('mouseup', onCanvasMouseUp, false);
                
            }
            function onCanvasTouchStart( event ){
                cleanPopUps();  
                if(event.touches.length == 1)
                {
                    event.preventDefault();
                    
                    brush.strokeStart( event.touches[0].pageX, event.touches[0].pageY );
                    
                    container.addEventListener('touchmove', onCanvasTouchMove, false);
                    container.addEventListener('touchend', onCanvasTouchEnd, false);
                }
                return false;
            }
            function onCanvasTouchMove( event ){
                if(event.touches.length == 1)
                {
                    event.preventDefault();
                    brush.stroke( event.touches[0].pageX, event.touches[0].pageY );
                }
            }
            function onCanvasTouchEnd( event ){
                if(event.touches.length == 0)
                {
                    event.preventDefault();
                    
                    brush.strokeEnd();

                    container.removeEventListener('touchmove', onCanvasTouchMove, false);
                    container.removeEventListener('touchend', onCanvasTouchEnd, false);
                }
            }
            function onMenuClear()
            {
                context.clearRect(0, 0, CANVAS_WIDTH*2, CANVAS_HEIGHT*2);
                //saveToLocalStorage();
                brush.destroy();
                brush = eval("new " + BRUSH + "(context,constants)");
            }
            function onBrushChange()
            {
                if (BRUSH == ""){
                    return;                    
                }
                brush.destroy();
                brush = eval("new " + BRUSH + "(context,constants)");
            }
            function onColorChange( event ){
                brush.destroy();
                brush = eval("new " + BRUSH + "(context,constants)");
                // COLOR = foregroundColorSelector.getColor();
                // menu.setForegroundColor( COLOR );
                // if (STORAGE){
                //     localStorage.brush_color_red = COLOR[0];
                //     localStorage.brush_color_green = COLOR[1];
                //     localStorage.brush_color_blue = COLOR[2];
                // }
            }
            function saveToLocalStorage()
            {
                localStorage.canvas = canvas.toDataURL('image/png');
            }
        }
    };
});
        /**********/
// const     BRUSHES = ["ribbon"],
//         USER_AGENT = navigator.userAgent.toLowerCase();

// var SCREEN_WIDTH = window.innerWidth,
//     SCREEN_HEIGHT = window.innerHeight,
//     BRUSH_SIZE = 2,
//     BRUSH_PRESSURE = 1,
//     COLOR = [0, 0, 0],
//     BACKGROUND_COLOR = [250, 250, 250],
//     brush,
//     saveTimeOut,
//     wacom,
//     i,
//     mouseX = 0,
//     mouseY = 0,
//     container,
//     canvas,
//     flattenCanvas,
//     context,
//     shiftKeyIsDown = false,
//     altKeyIsDown = false;

// init();
// function init()
// {
//     var hash, palette, embed;
    
//     if (USER_AGENT.search("android") > -1 || USER_AGENT.search("iphone") > -1)
//         BRUSH_SIZE = 2;    
        
//     if (USER_AGENT.search("safari") > -1 && USER_AGENT.search("chrome") == -1) // Safari
//         STORAGE = false;
    
//     document.body.style.backgroundRepeat = 'no-repeat';
//     document.body.style.backgroundPosition = 'center center';    
//     container = document.createElement('div');
//     document.body.appendChild(container);
//     canvas = document.createElement("canvas");
//     canvas.width = SCREEN_WIDTH;
//     canvas.height = SCREEN_HEIGHT;
//     canvas.style.cursor = 'crosshair';
//     container.appendChild(canvas);
//     context = canvas.getContext("2d");
//     flattenCanvas = document.createElement("canvas");
//     flattenCanvas.width = SCREEN_WIDTH;
//     flattenCanvas.height = SCREEN_HEIGHT;
//     if (window.location.hash)
//     {
//         hash = window.location.hash.substr(1,window.location.hash.length);
//         for (i = 0; i < BRUSHES.length; i++)
//         {
//             if (hash == BRUSHES[i])
//             {
//                 brush = eval("new " + BRUSHES[i] + "(context)");
//                 menu.selector.selectedIndex = i;
//                 break;
//             }
//         }
//     }
//     if (!brush)
//     {
//         brush = eval("new " + BRUSHES[0] + "(context)");
//     }
//     window.addEventListener('mousemove', onWindowMouseMove, false);
//     window.addEventListener('resize', onWindowResize, false);
//     window.addEventListener('blur', onWindowBlur, false);
//     document.addEventListener('mousedown', onDocumentMouseDown, false);
//     document.addEventListener('mouseout', onDocumentMouseOut, false);
//     canvas.addEventListener('mousedown', onCanvasMouseDown, false);
//     canvas.addEventListener('touchstart', onCanvasTouchStart, false);
//     onWindowResize(null);
// }
// WINDOW
// function onWindowMouseMove( event )
// {
//     mouseX = event.clientX;
//     mouseY = event.clientY;
// }

// function onWindowResize()
// {
//     SCREEN_WIDTH = window.innerWidth;
//     SCREEN_HEIGHT = window.innerHeight;
    
// }
// function onWindowBlur( event )
// {
//     shiftKeyIsDown = false;
//     altKeyIsDown = false;
// }
// // DOCUMENT
// function onDocumentMouseDown( event )
// {
//     event.preventDefault();
// }
// function onDocumentMouseOut( event )
// {
//     onCanvasMouseUp();
// }
// // CANVAS
// function onCanvasMouseDown( event )
// {
//     var data, position;
//     clearTimeout(saveTimeOut);
//     if (altKeyIsDown)
//     {
//         flatten();
//         data = flattenCanvas.getContext("2d").getImageData(0, 0, flattenCanvas.width, flattenCanvas.height).data;
//         position = (event.clientX + (event.clientY * canvas.width)) * 4;
//         return;
//     }    
//     brush.strokeStart( event.clientX, event.clientY );
//     window.addEventListener('mousemove', onCanvasMouseMove, false);
//     window.addEventListener('mouseup', onCanvasMouseUp, false);
// }
// function onCanvasMouseMove( event )
// {    
//     brush.stroke( event.clientX, event.clientY );
// }
// function onCanvasMouseUp()
// {
//     brush.strokeEnd();
//     window.removeEventListener('mousemove', onCanvasMouseMove, false);
//     window.removeEventListener('mouseup', onCanvasMouseUp, false);
    
// }
// function onCanvasTouchStart( event )
// {
//     cleanPopUps();        

//     if(event.touches.length == 1)
//     {
//         event.preventDefault();
        
//         brush.strokeStart( event.touches[0].pageX, event.touches[0].pageY );
        
//         window.addEventListener('touchmove', onCanvasTouchMove, false);
//         window.addEventListener('touchend', onCanvasTouchEnd, false);
//     }
// }
// function onCanvasTouchMove( event )
// {
//     if(event.touches.length == 1)
//     {
//         event.preventDefault();
//         brush.stroke( event.touches[0].pageX, event.touches[0].pageY );
//     }
// }
// function onCanvasTouchEnd( event )
// {
//     if(event.touches.length == 0)
//     {
//         event.preventDefault();
        
//         brush.strokeEnd();

//         window.removeEventListener('touchmove', onCanvasTouchMove, false);
//         window.removeEventListener('touchend', onCanvasTouchEnd, false);
//     }
// }
// function saveToLocalStorage()
// {
//     localStorage.canvas = canvas.toDataURL('image/png');
// }
// function flatten()
// {
//     var context = flattenCanvas.getContext("2d");
    
//     context.fillStyle = 'rgb(' + BACKGROUND_COLOR[0] + ', ' + BACKGROUND_COLOR[1] + ', ' + BACKGROUND_COLOR[2] + ')';
//     context.fillRect(0, 0, canvas.width, canvas.height);
//     context.drawImage(canvas, 0, 0);
// }