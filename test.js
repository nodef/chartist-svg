const chartistSvg = require('./');


var data = {
  title: 'Time to play PUBG',
  subtitle: 'Player Unknown\'s Battleground',
  labels: ['P', 'U', 'B', 'G'],
  series: [
    [1, 2, 3, 4],
    [3, 4, 5, 6]
  ]
};
var options = {
  css: '.ct-chart-line .ct-series .ct-point { stroke: green; }'
};
chartistSvg('line', data, options).then(svg => console.log(svg));
