'use strict';

var _ = require('lodash');
var Grid = require('term-grid');
var grid = null;

module.exports = function(tools) {
  // Track the entry page.
  tools.analytics.pageview('display').send();

  /**
   * Format a number for nice table outputs.
   *
   * @param num {String|Number}
   *   Convert a value to its number representation with 2 decimal places.
   * @returns {string}
   */
  var format = function(num) {
    return (Number(num).toFixed(2))
  };

  /**
   * Wrap the given number in a tools.chalk color
   *
   * @param num {Number}
   *   The Number to wrap, based upon is +/- value.
   * @returns {*}
   */
  var color = function(num) {
    return (num < 0)
      ? tools.chalk.bgRed(num)
      : tools.chalk.bgGreen(num);
  };

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

    // Update the labels to be underlined.
    labels = _.map(labels, function(l) { return tools.chalk.underline(l)});

    // Load the ticker data for the given stocks in the portfolio.
    tools.loadTicker(Object.keys(_portfolio.stocks), fields, function(err, data) {
      if (err) {
        tools.cli.debug(err);

        // Return a nice message if the portfolio is empty.
        if (Object.keys(_portfolio.stocks).length === 0) {
          return tools.cli.error('No stocks configured for display.');
        }

        return tools.error(err, true);
      }

      // The running total of the stocks.
      var total = 0;

      // Build the data grid for all the stocks in the portfolio.
      var output = [labels];
      _.forEach(data, function(result) {
        tools.cli.debug(JSON.stringify(result));

        // Check for bad ticker symbols.
        if (!result.hasOwnProperty('name') || !result.name || result.name === null) {
          if (!result.symbol) return;

          tools.cli.info('Unknown ticker symbol given: ' + result.symbol);
          tools.analytics.event('ticker', 'error', result.symbol).send();
          return;
        }

        // Calculate the number of shares for display and money calculations.
        var shares = (_portfolio.stocks[result.symbol].hasOwnProperty('orders') && _portfolio.stocks[result.symbol].orders)
          ? _.sum(_portfolio.stocks[result.symbol].orders, function(order) { return Number(order.shares); })
          : 0;

        // Calculate the sum and update the running total.
        var sum = (shares * Number(result.ask).toFixed(2));
        total +=  sum;

        // Build the data grid row.
        output.push([
          result.symbol,
          result.name,
          format(result.ask),
          format(result.bid),
          color(format(Number(result.changeInPercent) * 100)),
          color(format(result.change)),
          shares,
          color(format(shares * result.change)),
          format(sum)
        ]);
      });

      // Add the Money/running total to the data grid.
      var cash = (_portfolio.hasOwnProperty('money') && _portfolio.money.hasOwnProperty('usd') && _portfolio.money.usd)
        ? Number(_portfolio.money.usd)
        : 0;
      total += cash;
      output.push([tools.chalk.underline('Cash'), '', '', '', '', '', '', '', tools.chalk.underline(format(cash))]);
      output.push([tools.chalk.underline('Total'), '', '', '', '', '', '', '', tools.chalk.underline(format(total))]);

      // Build and render the data grid before exiting.
      grid = new Grid(output);
      grid.setAlign(['left', 'left', 'right', 'right', 'right', 'right', 'right', 'right', 'right']);
      grid.draw();
    });
  });
};
