'use strict';

var path = require('path');
var yahoo = require('yahoo-finance');

module.exports = function(cli, options) {
  var _portfolio = {};

  var loadPortfolio = function(next) {
    if (path.extname(options.portfolio).toLowerCase() === '.json') {
      return loadPortfolioJSON(next);
    }
    else {
      cli.error('Invalid Portfolio type given: ' + path.extname(options.portfolio).toLowerCase());
      cli.exit();
    }
  };

  var loadPortfolioJSON = function(next) {
    var portfolio = require(options.portfolio);

    // Build the stock list
    _portfolio.stocks = (portfolio.hasOwnProperty('stocks') && portfolio.stocks)
      ? portfolio.stocks
      : {};

    return next(_portfolio);
  };

  var loadTicker = function(symbols, fields, next) {
    symbols = [].concat(symbols);
    fields = [].concat(fields);

    yahoo.snapshot({symbols: symbols, fields: fields}, next);
  };

  return {
    cli: cli,
    options: options,
    loadPortfolio: loadPortfolio,
    loadTicker: loadTicker
  };
};
