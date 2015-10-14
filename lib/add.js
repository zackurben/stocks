'use strict';

module.exports = function(tools) {
  var _ga = tools.analytics.pageview('add');

  // Verify that the add command was used properly.
  if (!tools.options.hasOwnProperty('add') || !tools.options.add) {
    _ga.send();
    tools.error('Unknown user input for `add`', true);
  }
  else {
    _ga.event('add', tools.options.add.toString()).send();
  }

  // Parse the given input and fail if incorrect.
  var data = tools.options.add.split(',');
  if (data.length > 4 || data.length < 3) {
    tools.cli.info('Correct format for adding symbols is: symbol,shares,price[,m/d/y date]');
    return tools.error('Expected add to be 3-4 elements, got ' + data.length + ' -> ' + JSON.stringify(data), true);
  }

  // Load the portfolio and merge the given + existing data together.
  tools.loadPortfolio(function(portfolio) {
    tools.cli.debug(portfolio);
    portfolio.stocks = portfolio.stocks || {};

    portfolio.stocks[String(data[0]).toUpperCase()] = portfolio.stocks[String(data[0]).toUpperCase()] || {};
    portfolio.stocks[String(data[0]).toUpperCase()].orders = portfolio.stocks[String(data[0]).toUpperCase()].orders || [];
    var temp = {
      shares: Number(data[1]),
      price: Number(data[2])
    };

    // Add the optional date if present.
    if (data[3]) {
      temp.date = String(data[3]);
    }

    tools.cli.debug(temp);
    portfolio.stocks[String(data[0]).toUpperCase()].orders.push(temp);

    // Save the portfolio.
    tools.persistPortfolioJSON(portfolio);
  });
};
