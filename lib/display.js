'use strict';

var _ = require('lodash');
var Grid = require('term-grid');
var grid = null;

module.exports = function(tools) {
  tools.loadPortfolio(function(data) {
    var _portfolio = data;
    var labels = ['Symbol', 'Name', 'Ask', 'Bid', 'Change %', 'Change $', 'Shares', 'G/L $', 'Total $'];
    var fields = [
      's', // Symbol
      'n', // Name
      'a', // Ask
      'b', // Bid
      'p2', // Change in Percent
      'c1'  // Change in Amount
    ];

    // Load the ticker data for the given stocks in the portfolio.
    tools.loadTicker(Object.keys(_portfolio.stocks), fields, function(err, data) {
      if (err) {
        tools.cli.error(err);
        return tools.cli.exit();
      }

      // The running total of the stocks.
      var total = 0;

      // Build the data grid for all the stocks in the portfolio.
      var output = [labels];
      _.forEach(data, function(result) {
        tools.cli.debug(JSON.stringify(result));

        // Calculate the number of shares for display and money calculations.
        var shares = (_portfolio.stocks[result.symbol].hasOwnProperty('orders') && _portfolio.stocks[result.symbol].orders)
          ? _.sum(_portfolio.stocks[result.symbol].orders, function(order) { return new Number(order.shares); })
          : 0;

        // Calculate the sum and update the running total.
        var sum = (shares * new Number(result.ask).toFixed(2));
        total +=  sum;

        // Push this sorted ticker data to the data grid.
        output.push([
          result.symbol,
          result.name,
          (new Number(result.ask).toFixed(2)),
          (new Number(result.bid).toFixed(2)),
          ((new Number(result.changeInPercent) * 100).toFixed(2)),
          result.change,
          shares,
          (shares * result.change).toFixed(2),
          sum
        ]);
      });

      // Add the Money/running total to the data grid.
      var cash = (_portfolio.hasOwnProperty('money') && _portfolio.money.hasOwnProperty('usd') && _portfolio.money.usd)
        ? new Number(_portfolio.money.usd)
        : 0;
      total += cash;
      output.push(['Cash', '', '', '', '', '', '', '', cash]);
      output.push(['Total', '', '', '', '', '', '', '', total]);

      // Build and render the data grid before exiting.
      grid = new Grid(output);
      grid.draw();
    });
  });
};
