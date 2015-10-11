'use strict';

var path = require('path');
var yahoo = require('yahoo-finance');
var _ = require('lodash');
var ua = require('universal-analytics');

module.exports = function(cli, options) {
  var analytics = ua('UA-68610958-1').debug();
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
    _portfolio.stocks = _.get(portfolio, 'stocks', {});

    // Build the money list.
    _portfolio.money = {
      usd: _.get(portfolio, 'money.usd', 0)
    };

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
    loadTicker: loadTicker,
    analytics: analytics
  };
};
