'use strict';

var _ = require('lodash');
var Grid = require('term-grid');
var grid = null;

module.exports = function(tools) {
  tools.loadPortfolio(function(data) {
    var labels = ['Symbol', 'Name', 'Ask', 'Bid'];
    var fields = [
      's', // Symbol
      'n', // Name
      'a', // Ask
      'b'  // Bid
    ];

    tools.loadTicker(Object.keys(data.stocks), fields, function(err, data) {
      if (err) {
        tools.cli.error(err);
        return tools.cli.exit();
      }

      var output = [labels];
      _.forEach(data, function(result) {
        output.push([result.symbol, result.name, (new Number(result.ask).toFixed(2)), (new Number(result.bid).toFixed(2))]);
      });

      grid = new Grid(output);
      grid.draw();
    });
  });
};
