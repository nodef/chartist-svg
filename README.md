# chartist-svg

[![NPM](https://nodei.co/npm/chartist-svg.png)](https://nodei.co/npm/chartist-svg/)

Generate SVG chart using [chartist] on node.js
> You can paste the SVG code to a file directly.

```javascript
const chartist = require('chartist-svg');
// chartist(<type>, <data>, [options])
// -> Promise: "svg code"

// type: 'line', 'bar', or 'pie'

// data: {
//   title: 'title', subtitle: 'subtitle',
//   labels: ['A', 'B', 'C'], series: [
//     [1, 2, 3],
//     [4, 5, 6]
//   ]
// }

// options: {
//   chart: {
//     width: 1200, height: 600,
//     chartPadding: {left: 20, right: 100}
//   },
//   title: {
//     x: 0, y: 0, height: 48,
//     'font-size': '18px', 'font-family': 'Verdana', 'font-weight': 'bold',
//     fill: 'crimson', 'text-anchor': 'middle', (... other svg attributes)
//   },
//   subtitle: {
//     x: 0, y: 0, height: 24,
//     'font-size': '12px', 'font-family': 'Verdana', 'font-weight': 'bold',
//     fill: 'indianred', 'text-anchor': 'middle', (... other svg attrbiutes)
//   }
// }


var data = {
  title: 'Time to play PUBG',
  subtitle: 'Player Unknown\'s Battleground',
  labels: ['P', 'U', 'B', 'G'],
  series: [
    [1, 2, 3, 4],
    [3, 4, 5, 6]
  ]
};
chartist('line', data).then(svg => console.log(svg));
/* (generated svg can be used independently) */
/* (it is not dependent upon any external css) */
// <svg xmlns="http://www.w3.org/2000/svg" ... 
// ... text-anchor="middle">Player Unknown's Battleground</text></svg>
```


[chartist]: https://www.npmjs.com/package/chartist
