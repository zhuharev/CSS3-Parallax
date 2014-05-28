CSS3-Parallax
=============

Plain JavaScript and CSS3 Parallax that chases your mouse around the screen.

## Why?

I grew tired of having to use jQuery to manage the simple CSS manipulation of DOM elements. As useful as the library is, it's bloated for most of my own purposes.

_No developer should be required to install a large JavaScript library for mere DOM manipulation!_

Very few (if any) plain JavaScript parallax scripts exist that support both 3D perspective-enhanced viewing as well as 2D parallax.

Enter **CSS3-Parallax**, the vanilla gorilla of parallax scripts.

## Browser Compatibility

Desktop only as the script relies on cursor movement.
_TODO: Add device orientation event listeners for mobile devices._

* IE 9+
* Chrome 35+*
* Firefox 29+*

_* indicates latest at time of writing_

All other browsers are currently untested. Please feel free to submit a pull request, test and update the codebase & documentation as you please.

## Usage

#### Basic usage:

```javascript
Parallax('#picture');
```

#### All parameters (defaults below):
```javascript
Parallax(
  '#picture', // DOM node
  {
    mode      : '2D' // {string} '2D' or '3D', the type of parallax transformation used
    speed     : 100, // {number} Movement velocity of 2D Parallax elements relative to the mouse
    degrees   : 20,  // {number} Determines the angle through which to rotate 3D Parallax elements
    vendors   : ['webkit', 'moz', 'o', 'ms'], // {array} Browser-specific CSS3 prefixes
    reverse   : true // {boolean} Whether to move 2D parallaxed items away from or towards the mouse
    hardware  : true // {boolean} Set to false if IE9 support is required for 2D transformations 
  }
);
```

## Example

#### Coming soon!
