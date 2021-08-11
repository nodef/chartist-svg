const fs = require('fs');
const svgdomCss = require('svgdom-css');
const Chartist = require('chartist');




const CSSPATH = require.resolve('chartist/dist/chartist.min.css');
var   CSSDATA = '';  // delay loading
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

const FUNCTION = new Map([
  ['bar', Chartist.Bar],
  ['line', Chartist.Line],
  ['pie', Chartist.Pie],
]);




function tag(nam, cnt='', att={}) {
  var z = document.createElement(nam);
  for (var k in att)
    z.setAttribute(k, att[k]);
  z.textContent = cnt;
  return z;
}

function title(txt, x=0, y=0, o={}) {
  o.x += x; o.y += y;
  return tag('text', txt, o);
}




function defaults(o) {
  var options = Object.assign({width: 1200, height: 600, chartPadding: {left: 20, right: 100}}, o.options, o.chart);
  var resOptions = o.resOptions||o.resChart||[], onDraw = o.onDraw||null;
  var css = o.css||'', h = Math.min(options.width, options.height);
  var title = Object.assign({x: 0, y: 0, height: 0.08*h, 'font-size': `${0.03*h}px`, 'font-family': 'Verdana', 'font-weight': 'bold', fill: 'crimson', 'text-anchor': 'middle', role: 'caption'}, o.title);
  var subtitle = Object.assign({x: 0, y: 0, height: 0.04*h, 'font-size': `${0.02*h}px`, 'font-family': 'Verdana', 'font-weight': 'bold', fill: 'indianred', 'text-anchor': 'middle'}, o.subtitle);
  return Object.assign({options, resOptions, onDraw, css, title, subtitle}, o);
}


/**
 * Generate SVG chart using Chartist.
 * @param {string} type chart type (line, bar, pie)
 * @param {object} data chartist data (inc. title, subtitle)
 * @param {object} [o] options
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
  var o = defaults(o);
  window = svgdomCss(o.css+'\n'+CSSCUSTOM+'\n'+CSSDATA);
  document = window.document;
  var w  = o.options.width,  h = o.options.height;
  var th = o.title.height, sth = o.subtitle.height;
  var div = document.createElement('div');
  document.querySelector('svg').appendChild(div);

  // Create chart.
  var fn = FUNCTION.get(type);
  var chart = new fn(div, data, o.options, o.resOptions);
  return new Promise((fres) => {
    if (o.onDraw) chart.on('draw', o.onDraw);
    chart.on('created', () => {
      var svg = div.querySelector('svg');
      var ttl = title(data.title, 0.5*w, 0.6*th, o.title);
      var stl = title(data.subtitle, 0.5*w, th+0.6*sth, o.subtitle);
      for(var e of div.querySelectorAll('svg > g'))
        e.setAttribute('transform', `translate(0, ${th+sth})`);
      for(var e of div.querySelectorAll('svg .ct-label.ct-horizontal'))
        e.setAttribute('transform', `rotate(20, ${e.getAttribute('x')}, ${e.getAttribute('y')}) translate(-10, 0)`);
      svg.setAttribute('height', h+th+sth+0.2*h);
      svg.setAttribute('style', '');
      svg.appendChild(ttl);
      svg.appendChild(stl);
      window.setComputedStyle(div);
      var txt = div.innerHTML;
      div.parentNode.removeChild(div);
      fres(txt);
    });
  });
}
module.exports = chartistSvg;
