'use strict';

var path = require('path');
var yahoo = require('yahoo-finance');
var _ = require('lodash');
var analytics = require('universal-analytics')('UA-68610958-1');
var chalk = require('chalk');

module.exports = function(cli, options) {
  var _portfolio = {};

  var loadPortfolio = function(next) {
    if (path.extname(options.portfolio).toLowerCase() === '.json') {
      return loadPortfolioJSON(next);
    }
    else {
      error('Invalid Portfolio type given: ' + path.extname(options.portfolio).toLowerCase(), true);
    }
  };

  var loadPortfolioJSON = function(next) {
    var portfolio = null;

    try {
      portfolio = require(options.portfolio);
    }
    catch(err) {
      // Track the error for bug fixes.
      error((err.message || err), false);

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

    // Track the symbols being monitored.
    var _ga = analytics.event('ticker', 'load', 'symbols', Number(symbols.length));
    _.forEach(symbols, function(s) {
      _ga.event('ticker', 'search', s.toString());
    });
    _ga.send();

    yahoo.snapshot({symbols: symbols, fields: fields}, next);
  };

  /**
   * A simple error handler for logging issues.
   *
   * @param msg {string}
   *   The error message to output/track.
   * @param fatal {boolean}
   *   If this error is fatal or not (program will exit if fatal).
   */
  var error = function(msg, fatal) {
    fatal = (typeof fatal !== 'boolean')
      ? false
      : fatal;

    cli.debug('Error (' + fatal + '): ' + msg);

    // Track the error for fixes.
    analytics.exception(msg, fatal).send();

    // Show the user the error and potentially exit.
    cli.error(msg);
    if (fatal) {
      cli.exit();
    }
  };

  return {
    cli: cli,
    options: options,
    loadPortfolio: loadPortfolio,
    loadTicker: loadTicker,
    analytics: analytics,
    error: error,
    chalk: chalk
  };
};
