const chartist = require('./');


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
