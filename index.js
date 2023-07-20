const fs = require('fs');
const svgdomCss = require('svgdom-css');
const Chartist  = require('chartist');




// CONSTANTS
// =========

/** Path to Chartist CSS file. */
const CSSPATH = require.resolve('chartist/dist/index.css');
/** Custom CSS for Chartist. */
const CSSCUSTOM =
`.ct-label.ct-vertical {
  font-family: Courier;
  font-weight: bold;
  font-size: 14px;
  text-anchor: end;
}
.ct-label.ct-horizontal {
  font-family: Courier;
  font-weight: bold;
  font-size: 14px;
  fill: crimson;
  text-anchor: start;
}`;
/** Map of Chartist functions. */
const FUNCTION = new Map([
  ['bar',  Chartist.BarChart],
  ['line', Chartist.LineChart],
  ['pie',  Chartist.PieChart],
]);




// GLOBAL VARIABLES
// ================

var CSSDATA = '';  // Delay loading CSS file.




// METHODS
// =======

// UTILITY
// -------

/**
 * Create an element with attributes and content.
 * @param {string} name tag name
 * @param {string} content text content
 * @param {object<string, string>} attrs attributes
 * @returns {Element} element
 */
function createElement(name, content='', attrs={}) {
  var a = document.createElement(name);
  for (var k in attrs)
    a.setAttribute(k, attrs[k]);
  a.textContent = content;
  return a;
}


/**
 * Create a title element for Chartist.
 * @param {string} text title text
 * @param {number} x x-coordinate
 * @param {number} y y-coordinate
 * @param {Object} o attributes
 * @returns {Element} title element
 */
function createTitle(text, x=0, y=0, o={}) {
  o.x += x;
  o.y += y;
  return createElement('text', text, o);
}




// DEFAULT OPTIONS
// ---------------

/**
 * Set default options.
 * @param {Object} o options
 * @returns {Object} options
 */
function defaults(o) {
  // Set options.
  var options = Object.assign({
    width:  1200,
    height: 600,
    chartPadding: {
      left:  20,
      right: 100,
    },
  }, o.options, o.chart);
  // Set responsive options.
  var resOptions = o.resOptions || o.resChart || [];
  // Set onDraw handler, css.
  var onDraw = o.onDraw || null;
  var css    = o.css    || '';
  // Set title and subtitle.
  var h      = Math.min(options.width, options.height);
  var title  = Object.assign({
    x: 0,
    y: 0,
    height: 0.08*h,
    'font-size':   `${0.03*h}px`,
    'font-family': 'Verdana',
    'font-weight': 'bold',
    'text-anchor': 'middle',
    fill: 'crimson',
    role: 'caption',
  }, o.title);
  var subtitle = Object.assign({
    x: 0,
    y: 0,
    height: 0.04*h,
    'font-size':   `${0.02*h}px`,
    'font-family': 'Verdana',
    'font-weight': 'bold',
    'text-anchor': 'middle',
    fill: 'indianred',
  }, o.subtitle);
  return Object.assign({}, o, {options, resOptions, onDraw, css, title, subtitle});
}




// MAIN
// ----

/**
 * Generate SVG chart using Chartist.
 * @param {string} type chart type (line, bar, pie)
 * @param {object} data chartist data (inc. title, subtitle)
 * @param {object} [o] options
 * @param {object} [o.chart] chartist options (width, height, chartPadding, ...)
 * @param {object} [o.options] chartist options (width, height, chartPadding, ...)
 * @param {object} [o.resOptions] chartist responsive options
 * @param {object} [o.onDraw] chartist on 'draw' handler
 * @param {object} [o.css] custom css
 * @param {object} [o.title] title attributes (x, y, height, font-size, ...)
 * @param {object} [o.subtitle] subtitle attributes (x, y, height, font-size, ...)
 * @returns {Promise<string>} svg code (independent)
 */
function chartistSvg(type, data, o={}) {
  // Load chartist CSS.
  if (!CSSDATA) CSSDATA = fs.readFileSync(CSSPATH, 'utf8');

  // Setup window with svg.
  var o    = defaults(o);
  window   = svgdomCss(o.css + '\n' + CSSCUSTOM + '\n' + CSSDATA);
  document = window.document;
  var w    = o.options.width,  h = o.options.height;
  var th   = o.title.height, sth = o.subtitle.height;
  var div  = document.createElement('div');
  document.querySelector('svg').appendChild(div);

  // Create chart.
  var fn    = FUNCTION.get(type);
  var chart = new fn(div, data, o.options, o.resOptions);
  return new Promise(resolve => {
    if (o.onDraw) chart.on('draw', o.onDraw);
    chart.on('created', () => {
      var svg = div.querySelector('svg');
      var title    = createTitle(data.title,    0.5*w,      0.6*th,  o.title);
      var subtitle = createTitle(data.subtitle, 0.5*w, th + 0.6*sth, o.subtitle);
      for(var e of div.querySelectorAll('svg > g'))
        e.setAttribute('transform', `translate(0, ${th + sth})`);
      for(var e of div.querySelectorAll('svg .ct-label.ct-horizontal'))
        e.setAttribute('transform', `rotate(20, ${e.getAttribute('x')}, ${e.getAttribute('y')}) translate(-10, 0)`);
      svg.setAttribute('height', h + th + sth + 0.2*h);
      svg.setAttribute('style', '');
      svg.appendChild(title);
      svg.appendChild(subtitle);
      window.setComputedStyle(div);
      var text = div.innerHTML;
      div.parentNode.removeChild(div);
      resolve(text);
    });
  });
}
module.exports = chartistSvg;
