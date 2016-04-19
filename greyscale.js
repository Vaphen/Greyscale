/********************************
 *      Author: Vaphen          *
 *    Last Edit: 04/18/2016     *
 *  Feel free to use this code  *
 *     in any way you like      *
 ********************************/
(function() {
  // add custom animate_greyscale function to default jquery library
  (function( $ ) {
      $.fn.greyscale = function(value, time) {
        animate_greyscale(this, value, time);
        return this;
      };
      $.fn.greyscaleOn = function(time) {
        animate_greyscale(this, 100, time);
        return this;
      };
      $.fn.greyscaleOff = function(time) {
        animate_greyscale(this, 0, time);
        return this;
      };
  }(jQuery));

  /* Function animate_greyscale
   * element: a jquery object of the image element that should be greyscaled
   * value: a value between 0 and 100 (percentage); 100 = it's greyed out, 0 it's colored
   * time: the animation time (in ms)
   */
  function animate_greyscale(element, value, time) {
    // invariants
    if(time < 1) {
      console.error("Time cannot be less than 1.");
      return;
    }
    if(value < 0 || value > 100) {
      console.error("Value is not a percentage Integer between 0 and 100 (inclusive).");
      return;
    }
    if(!element) {
      console.error("The received element is not valid.");
      return;
    }

    function separateFilterValue(cssAttribute) {
      if(cssAttribute == 'none') {
        return 0;
      }
      cssAttribute = cssAttribute.split('grayscale(')[1];
      cssAttribute = cssAttribute.split('%)')[0];
      cssAttribute = parseInt(cssAttribute);
      if(isNaN(cssAttribute)) {
        // in case it is given as greyscale(1), we need this split
        cssAttribute = cssAttribute.split(')')[0];
        // because the range of this notation is between 0 and 1, we have to convert it to percentage
        cssAttribute = parseInt(cssAttribute * 100);
      }
      if(isNaN(cssAttribute) || cssAttribute < 0 || cssAttribute > 100) {
        return 0;
      }
      return cssAttribute;
    }

    // convert percent to decimal value (eg. 23% = 0.23)
    function percentToDecimal(percentValue) {
      return parseFloat((percentValue / 100).toFixed(2));
    }

    // calculate the optimum time amount to wait for next increase.
    function calculateOptimumTimeAmount(animationStep) {
      var stepsForChange = 1;
      var newStep = 0;


      animationStep = Math.abs(animationStep);

      // set a limitation at 1000 to prevent infinite loop
      for(var i = 1; i < 1000; i++) {
        newStep = newStep + animationStep;
        if(newStep >= 1) {
          return i;
        }
      }

      return 1000;
    }

    var curGreyscaleFilter = element.css("filter");

    // if just webkit-filter is set, we use that value
    if(!curGreyscaleFilter) {
      curGreyscaleFilter = element.css("-webkit-filter");
    }

    // separates the value; if value is invalid or not existant, it is set to 0
    curGreyscaleFilter = separateFilterValue(curGreyscaleFilter);

    // calculate the step-size for 1 ms
    var animationStep = parseInt(curGreyscaleFilter) - parseInt(value);
    animationStep = animationStep / time;
    // the time in ms that has to pass until the greyscale is in-/decreased by 1 (floating point number)
    var optimumStepAmount = calculateOptimumTimeAmount(animationStep);
    // check if we need to increment or decrement greyscale by 1
    var greyScalingUnit = (animationStep < 0) ? -1 : 1;

    // the number of the loop-walkthroughs
    var loopLimitation = (optimumStepAmount < 0) ? time * optimumStepAmount : time / optimumStepAmount;
    // loop for animation; stop if we loop more than 10000 times (prevent infinite loop)
    for(i = 0; i < loopLimitation && i <= 10000; i++) {
      (function(index) {
          // change greyscale all optimumStepAmount seconds by timeout the for-loop
          setTimeout(function() {
            curGreyscaleFilter -= (optimumStepAmount * animationStep);
            // curGreyscaleFilter is a floating point number; we have to round it
            var roundedGreyscale = (animationStep < 0) ? Math.floor(curGreyscaleFilter) : Math.ceil(curGreyscaleFilter);
            // set all possible filter values for best crossbrowser support
            element.css("filter", "grayscale(" + roundedGreyscale + "%)");
            element.css("-webkit-filter", "grayscale(" + roundedGreyscale + "%)");
            element.css("-webkit-filter", "grayscale(" + percentToDecimal(roundedGreyscale) + ")");
          }, optimumStepAmount * index);
      })(i);
    }
  }
})();
