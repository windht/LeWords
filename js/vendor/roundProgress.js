// shim layer with setTimeout fallback
// credit Erik Möller and http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame){
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame){
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }

}());

angular.module('angular-svg-round-progress', []);

'use strict';

angular.module('angular-svg-round-progress').constant('roundProgressConfig', {
    max:            50,
    semi:           false,
    rounded:        false,
    radius:         100,
    color:          "#45ccce",
    bgcolor:        "#eaeaea",
    stroke:         15,
    iterations:     50,
    animation:      "easeOutCubic"
});

'use strict';

angular.module('angular-svg-round-progress').service('roundProgressService', [function(){
    var service = {};

    // credits to http://modernizr.com/ for the feature test
    service.isSupported = !!(document.createElementNS && document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect);

    // utility function
    var polarToCartesian = function(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    var describeArc=function(x, y, radius, startAngle, endAngle){

        var start = polarToCartesian(x, y, radius, endAngle);
        var end = polarToCartesian(x, y, radius, startAngle);
        var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
        var d = [
            "M", start.x, start.y, 
            "A", radius, radius, 0, arcSweep, 0, end.x, end.y
        ].join(" ");
        return d;       
    }

    // credit to http://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
    service.updateState = function(value, total, R, ring, border, size, isSemicircle) {

        if(!size) return ring;

        var value       = value >= total ? total - 0.00001 : value,
            type        = isSemicircle ? 180 : 359.9999,
            perc        = total === 0 ? 0 : (value / total) * type,
            x           = size/2,
            start       = polarToCartesian(x, x, R, perc), // in this case x and y are the same
            end         = polarToCartesian(x, x, R, 0),
            // arcSweep = endAngle - startAngle <= 180 ? "0" : "1",
            arcSweep    = (perc <= 180 ? "0" : "1"),
            dring = [
                "M", start.x, start.y,
                "A", R, R, 0, arcSweep, 0, end.x, end.y
            ].join(" ");
            dborder= [
                "M", start.x, start.y,
                "A", R, R, 0, arcSweep, 0, end.x, end.y
            ].join(" ");

            ring.attr('d', dring);


    };

    // Easing functions by Robert Penner
    // Source: http://www.robertpenner.com/easing/
    // License: http://www.robertpenner.com/easing_terms_of_use.html

    service.animations = {

        // t: Current iteration
        // b: Start value
        // c: Change in value
        // d: Total iterations

        linearEase: function(t, b, c, d) {
            return c * t / d + b;
        },

        easeInQuad: function (t, b, c, d) {
            return c*(t/=d)*t + b;
        },

        easeOutQuad: function (t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        },

        easeInOutQuad: function (t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 * ((--t)*(t-2) - 1) + b;
        },

        easeInCubic: function (t, b, c, d) {
            return c*(t/=d)*t*t + b;
        },

        easeOutCubic: function (t, b, c, d) {
            return c*((t=t/d-1)*t*t + 1) + b;
        },

        easeInOutCubic: function (t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        },

        easeInQuart: function (t, b, c, d) {
            return c*(t/=d)*t*t*t + b;
        },

        easeOutQuart: function (t, b, c, d) {
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
        },

        easeInOutQuart: function (t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        },

        easeInQuint: function (t, b, c, d) {
            return c*(t/=d)*t*t*t*t + b;
        },

        easeOutQuint: function (t, b, c, d) {
            return c*((t=t/d-1)*t*t*t*t + 1) + b;
        },

        easeInOutQuint: function (t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
            return c/2*((t-=2)*t*t*t*t + 2) + b;
        },

        easeInSine: function (t, b, c, d) {
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },

        easeOutSine: function (t, b, c, d) {
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },

        easeInOutSine: function (t, b, c, d) {
            return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
        },

        easeInExpo: function (t, b, c, d) {
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },

        easeOutExpo: function (t, b, c, d) {
            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },

        easeInOutExpo: function (t, b, c, d) {
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },

        easeInCirc: function (t, b, c, d) {
            return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
        },

        easeOutCirc: function (t, b, c, d) {
            return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
        },

        easeInOutCirc: function (t, b, c, d) {
            if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
            return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
        },

        easeInElastic: function (t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        },

        easeOutElastic: function (t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
        },

        easeInOutElastic: function (t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
        },

        easeInBack: function (t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },

        easeOutBack: function (t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },

        easeInOutBack: function (t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        },

        easeInBounce: function (t, b, c, d) {
            return c - service.animations.easeOutBounce (d-t, 0, c, d) + b;
        },

        easeOutBounce: function (t, b, c, d) {
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        },

        easeInOutBounce: function (t, b, c, d) {
            if (t < d/2) return service.animations.easeInBounce (t*2, 0, c, d) * .5 + b;
            return service.animations.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
        }
    };

    return service;
}]);

'use strict';

angular.module('angular-svg-round-progress')
    .directive('roundProgress', ['roundProgressService', 'roundProgressConfig', function(service, roundProgressConfig){

            if(!service.isSupported){
                return {
                    // placeholder element to keep the structure
                    restrict: 'EA',
                    template:'<div class="round-progress"></div>',
                    replace: true
                };
            };

            return {
                restrict:           "EA",
                scope:{
                    current:        "=",
                    max:            "=",
                    semi:           "=",
                    rounded:        "=",
                    radius:         "@",
                    color:          "@",
                    bgcolor:        "@",
                    stroke:         "@",
                    iterations:     "@",
                    animation:      "@"
                },
                link: function (scope, element, attrs) {
                    var ring        = element.find('path.ring'),
                        border        = element.find('circle.border'),
                        background  = element.find('circle.background'),
                        options     = angular.copy(roundProgressConfig),
                        size,
                        resetValue;

                    var renderCircle = function(){
                        var isSemicircle = options.semi,
                        radius           = parseInt(options.radius),
                        stroke           = parseInt(options.stroke);

                        size = radius*2 + stroke*2;

                        element.css({
                            "width":        size + "px",
                            "height":       (isSemicircle ? size/2 : size) + "px",
                            "overflow":     "hidden" // on some browsers the background overflows, if in semicircle mode
                        });

                        ring.css({
                            "stroke":       options.color,
                            "stroke-width": stroke,
                            "stroke-linecap": options.rounded ? "round": "butt"
                        }).attr("transform", isSemicircle ? ("translate("+ 0 +","+ size +") rotate(-90)") : "");
                        
                        border.attr({
                            "cx":           radius + stroke,
                            "cy":           radius + stroke,
                            "r":            radius*2
                        }).css({
                            "stroke":       "white",
                            "stroke-width": "1px"
                        });

                        background.attr({
                            "cx":           radius + stroke,
                            "cy":           radius + stroke,
                            "r":            radius
                        }).css({
                            "stroke":       options.bgcolor,
                            "stroke-width": stroke
                        });
                    };

                    var renderState = function (newValue, oldValue){
                        if(!angular.isDefined(newValue)){
                            return false;
                        };

                        if(newValue < 0){
                            resetValue = oldValue;
                            return scope.current = 0;
                        };

                        if(newValue > options.max){
                            resetValue = oldValue;
                            return scope.current = options.max;
                        };

                        var max             = options.max,
                        radius              = options.radius,
                        isSemicircle        = options.semi,
                        easingAnimation     = service.animations[options.animation],
                        start               = oldValue === newValue ? 0 : (oldValue || 0), // fixes the initial animation
                        val                 = newValue - start,
                        currentIteration    = 0,
                        totalIterations     = parseInt(options.iterations);

                        if(angular.isNumber(resetValue)){
                            // the reset value fixes problems with animation, caused when limiting the scope.current
                            start       = resetValue;
                            val         = newValue - resetValue;
                            resetValue  = null;
                        };

                        (function animation(){
                            service.updateState(
                                easingAnimation(currentIteration, start, val, totalIterations),
                                max,
                                radius,
                                ring,
                                border,
                                size,
                                isSemicircle);

                            if(currentIteration < totalIterations){
                                requestAnimationFrame(animation);
                                currentIteration++;
                            };
                        })();
                    };

                    scope.$watchCollection('[current, max, semi, rounded, radius, color, bgcolor, stroke, iterations]', function(newValue, oldValue, scope){

                        // pretty much the same as angular.extend,
                        // but this skips undefined values and internal angular keys
                        angular.forEach(scope, function(value, key){
                            // note the scope !== value is because `this` is part of the scope
                            if(key.indexOf('$') && scope !== value && angular.isDefined(value)){
                                options[key] = value;
                            };
                        });

                        renderCircle();
                        renderState(newValue[0], oldValue[0]);
                    });
                },
                replace:true,
                template:[
                    '<svg class="round-progress" xmlns="http://www.w3.org/2000/svg">',
                        '<circle class="background" fill="none"/>',
                        '<path class="ring" fill="none"/>',
                        '<circle class="border" fill="none"/>',
                    '</svg>'
                ].join('\n')
            };
        }]);
