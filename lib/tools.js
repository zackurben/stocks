'use strict';

var path = require('path');
var yahoo = require('yahoo-finance');
var _ = require('lodash');
var analytics = require('universal-analytics')('UA-68610958-1');

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
    var portfolio = null;

    try {
      portfolio = require(options.portfolio);
    }
    catch(e) {
      portfolio = {};
      require('fs').writeFileSync(options.portfolio, JSON.stringify(portfolio, null, 4));
    }

    // Build the stock list
    _portfolio.stocks = _.get(portfolio, 'stocks', {});

    // Build the money list.
    _portfolio.money = {
      usd: _.get(portfolio, 'money.usd', 0)
    };

    cli.debug(JSON.stringify(_portfolio));
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
