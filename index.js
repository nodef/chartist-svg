const css = require('svgdom-css');
const Chartist = require('chartist');
const fs = require('fs');

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
const CSSPATH = require.resolve('chartist/dist/chartist.min.css');
const STYLE = CSSCUSTOM+fs.readFileSync(CSSPATH, 'utf8');
css(STYLE);

const FUNCTION = new Map([
  ['bar', Chartist.Bar],
  ['line', Chartist.Line],
  ['pie', Chartist.Pie],
]);

function strChunk(txt, len=1, sep='') {
  for(var i=0, I=txt.length, z=''; i<I; i+=len)
    z += txt.substr(i, len)+sep;
  return z;
};

function tag(nam, cnt='', att={}) {
  var z = document.createElement(nam);
  for(var k in att)
    z.setAttribute(k, att[k]);
  z.textContent = cnt;
  return z;
};

function title(txt, x=0, y=0, o={}) {
  o.x += x; o.y += y;
  return tag('text', txt, o);
};

function defaults(o={}) {
  var chart = Object.assign({width: 1200, height: 600, chartPadding: {left: 20, right: 100}}, o.chart), h = Math.min(chart.width, chart.height);
  var title = Object.assign({x: 0, y: 0, height: 0.08*h, 'font-size': `${0.03*h}px`, 'font-family': 'Verdana', 'font-weight': 'bold', fill: 'crimson', 'text-anchor': 'middle', role: 'caption'}, o.title);
  var subtitle = Object.assign({x: 0, y: 0, height: 0.04*h, 'font-size': `${0.02*h}px`, 'font-family': 'Verdana', 'font-weight': 'bold', fill: 'indianred', 'text-anchor': 'middle'}, o.subtitle);;
  return Object.assign({}, o, {chart, title, subtitle});
};

function chart(typ, dat, o={}) {
  var o = defaults(o);
  var w = o.chart.width, h = o.chart.height;
  var th = o.title.height, sth = o.subtitle.height;
  var div = document.createElement('div');
  document.querySelector('svg').appendChild(div);
  var cht = new (FUNCTION.get(typ))(div, dat.value, o.chart);
  return new Promise((fres) => {
    cht.on('created', (data) => {
      var svg = div.querySelector('svg');
      var ttl = title(dat.title, 0.5*w, 0.6*th, o.title);
      var stl = title(dat.subtitle, 0.5*w, th+0.6*sth, o.subtitle);
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
};
module.exports = chart;
