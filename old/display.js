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
      var dailyTotal = 0; // Daily value of stocks.
      var dailyChange = 0; // Daily Gain/loss of stocks.
      var total = 0; // Total value of stocks.
      var change = 0; // Total Gain/loss of stocks.

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

        // Add the current stocks G/L to the running total.
        dailyChange += (shares * result.change);

        // Calculate the difference in share purchase price to current price.
        change += _.sum(_portfolio.stocks[result.symbol].orders, function(order) {
          if (!order.shares || !order.price) {
            return 0;
          }

          // Calculate the original purchase price.
          var orig = Number(order.shares) * order.price;
          // Calculate the new share prices.
          var curr = (result.bid * Number(order.shares));

          return curr - orig;
        });

        // Subtract all order fees from the gains.
        change -= _.sum(_portfolio.stocks[result.symbol].orders, function(order) {
          return order.fee || 0;
        });

        // Sum the total share value.
        total += _.sum(_portfolio.stocks[result.symbol].orders, function(order) {
          return (Number(shares) * result.bid) || 0;
        });

        // Calculate the sum and update the running total.
        var sum = (shares * Number(result.bid).toFixed(2));
        dailyTotal +=  sum;

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
      dailyTotal += cash;
      output.push(['', '', '', '', '', '', '', '', '']);
      output.push(['Cash', '', '', '', '', '', '', '', format(cash)]);
      output.push(['Daily', '', '', '', '', '', '', color(format(dailyChange)), format(dailyTotal)]);
      output.push(['Total', '', '', '', '', '', '', color(format(change)), format(total)]);

      // Build and render the data grid before exiting.
      grid = new Grid(output);
      grid.setAlign(['left', 'left', 'right', 'right', 'right', 'right', 'right', 'right', 'right']);
      grid.draw();
    });
  });
};
