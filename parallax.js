/**
 * Plain Old JavaScript & CSS3 Parallax plugin
 *
 * @author Ben Ceglowski
 * @version 0.1.0
 */

// Global object to indicate the presence of window.resize event listeners
var parallaxEventListeners = false;

/**
 * Parallax parent function
 *
 * @param {string} node The node to which Parallax will be applied
 * @return {object} The initialize function that instigates Parallax operations on a DOM object
 */
var Parallax = (function(node, settings) {

  'use strict';

  // Throw error if node is not detected
  if(typeof(document.querySelector(node)) === 'undefined') throw new Error('Parallax Error: Please specify an existing DOM node.');

  // Private variables
  var privates = {

    // A cached collection of DOM objects
    DOM : {
      body    : document.body,
      node    : document.querySelector(node)
    },

    // Initial bootstraps which can be affected by passing a settings object to the function
    settings : {

      // 3D or 2D Parallax effect
      mode      : '2D',

      // Determines the movement velocity of 2D Parallax elements relative to the mouse
      speed     : 100,

      // Determines the angle through which to rotate 3D Parallax elements
      degrees   : 20,

      // A list of common browser vendors
      vendors   : ['webkit', 'moz', 'o', 'ms'],

      // Hardware accelerate (using 3D transforms for 2D translation) by default
      hardware  : true
    },

    // An empty object literal used to contain screen dimensions
    dimensions : {},

    /**
     * Simple debounce function
     * 
     * @author David Walsh - http://davidwalsh.name/javascript-debounce-function
     * @return {function} Debounced function supplied as argument
     */
    debounce : function(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
      };
    },

    /**
     * Calculates window dimensions and node padding if need be
     * 
     * @return {void}
     */
    calculateDimensions : function() {

      // Cache full client width & height
      this.dimensions.clientWidth       = Math.ceil(this.DOM.body.clientWidth);
      this.dimensions.clientHeight      = Math.ceil(this.DOM.body.clientHeight);

      // Cache half client width & height
      this.dimensions.halfClientWidth   = Math.ceil(this.dimensions.clientWidth / 2);
      this.dimensions.halfClientHeight  = Math.ceil(this.dimensions.clientHeight / 2);

      // Calculate amount by which to pad 2D Parallax node
      if(this.settings.mode !== '3D') {
        this.dimensions.pad = Math.ceil(0.5 * this.settings.speed);
        this.DOM.node.setAttribute('style', 'padding: ' + this.dimensions.pad + 'px; margin: -' + this.dimensions.pad + 'px 0 0 -' + this.dimensions.pad + 'px;');
      }

    },

    /**
     * Adds Parallax event listeners to DOM
     *
     * @return {void}
     */
    addEvents : function() {

      // Substitute context of this
      var self = this;

      // Detect whether parallax event listeners are already set up
      if(parallaxEventListeners === false) {

        // Add debounced window.onresize event listener to recalculate document bounds
        window.addEventListener('resize', self.debounce(function() {
          self.calculateDimensions();
        }, 100));

        // Set the event listener status to true to prevent zombie events
        parallaxEventListeners = true;

      }

      // Add element repositioning event listener for each instance of Parallax
      document.addEventListener('mousemove', function(e) {
        self.reposition(e);
      });

    },

    /**
     * Repositions the Parallax object in relation to mouse position using CSS transforms
     *
     * @param {object} e Mousemove event parameters
     * @return {void}
     */
    reposition : function(e) {

      // Mouse position in relation to horizontal centre of screen
      var mouseX    = e.clientX - this.dimensions.halfClientWidth;

      // Mouse position in relation to vertical centre of screen
      var mouseY    = e.clientY - this.dimensions.halfClientHeight;

      // Loop counter
      var i         = 0;

      // Empty vendor CSS array
      var cssArray  = [];

      // Initialize empty numeric variables for later use
      var tiltX, tiltY, moveX, moveY, radius, degree, padding;

      // Switch supports indefinite cases
      switch (this.settings.mode) {

        // 3D-specific settings
        case '3D' :

          // No padding settings as yet
          padding   = '';

          // Set tilt along Y axis
          tiltY     = (mouseX / this.dimensions.clientWidth);

          // Set tilt along X axis
          tiltX     = -(mouseY / this.dimensions.clientHeight);

          // Set radius for rotation calculation
          radius    = Math.sqrt(Math.pow(tiltX, 2) + Math.pow(tiltY, 2));

          // Tilt by number of degrees specified in settings * radius
          degree    = (radius * this.settings.degrees);

          // Create vendor-specific CSS array
          for(i; i < this.settings.vendorsLength; i++) {
            cssArray.push((this.settings.vendors[i] ? '-' + this.settings.vendors[i] + '-' : '' ) + 'transform: rotate3d(' + tiltX + ', ' + tiltY + ', 0, ' + degree + 'deg);');
          }

        break;

        // 2D-specific settings
        default :

          // Set element padding
          padding   = 'padding: ' + this.dimensions.pad + 'px; margin: -' + this.dimensions.pad + 'px 0 0 -' + this.dimensions.pad + 'px;';

          // Set relative X movement coordinates
          moveX     = -(mouseX / this.dimensions.clientWidth * this.settings.speed);

          // Set relative Y movement coordinates
          moveY     = -(mouseY / this.dimensions.clientHeight * this.settings.speed);

          // Alter direction to follow mouse directly
          if(this.settings.reverse === false) {
            moveX = -(moveX);
            moveY = -(moveY);
          }

          // Create vendor-specific CSS array
          for(i; i < this.settings.vendorsLength; i++) {
            cssArray.push((this.settings.vendors[i] ? '-' + this.settings.vendors[i] + '-' : '' ) + 'transform: ' + this.settings.translate + '(' + moveX + 'px, ' + moveY + 'px' + (this.settings.hardware === true ? ', 0' : '') + ');');
          }

      }

      // Join CSS array
      var styles = cssArray.join('');

      // Set style of parallax element
      this.DOM.node.setAttribute('style', styles + padding);

    }

  };

  /**
   * Initializes the Parallax script
   *
   * @param {object} settings User-defined settings used to extend defaults
   * @return {void}
   */
  var initialize = function(settings) {

    // Update defaults with specified settings
    for(var key in settings) {
      privates.settings[key] = settings[key];
    }

    privates.settings.translate = (privates.settings.hardware === false ? 'translate' : 'translate3d');

    // Cache length of browser vendors list
    privates.settings.vendorsLength = privates.settings.vendors.length;

    // Calculate window dimensions
    privates.calculateDimensions();

    // Apply DOM events
    privates.addEvents();

  };

  // Return public initialize object
  return initialize(settings);

});

// Enable Browserify or other CommonJS component organiser
if(typeof module !== 'undefined') module.exports = Parallax;