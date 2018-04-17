'use strict';

const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const yahoo = require('yahoo-stocks');

module.exports = (cli, options) => {
  const getPortfolio = () =>
    new Promise(resolve => {
      let portfolio;

      try {
        portfolio = require(options.portfolio);
      } catch (e) {
        // Create a new portfolio if one didn't exist.
        portfolio = require(path.join(__dirname, '../', 'example.json'));
        return savePortfolio(portfolio);
      }

      return resolve(portfolio);
    });

  const savePortfolio = portfolio =>
    new Promise((resolve, reject) => {
      fs.writeFile(
        options.portfolio,
        JSON.stringify(portfolio, null, 4),
        err => {
          if (err) {
            return reject(err);
          }

          return resolve(portfolio);
        }
      );
    });

  const getSymbol = symbol => yahoo.lookup(symbol);

  /**
   * A simple error handler for logging issues.
   *
   * @param msg {string}
   *   The error message to output/track.
   * @param fatal {boolean}
   *   If this error is fatal or not (program will exit if fatal).
   */
  const error = (msg, fatal) => {
    fatal = typeof fatal !== 'boolean' ? false : fatal;
    cli.debug(err.message || err);
    cli.debug(err.stack || JSON.stringify(err));

    // Show the user the error and potentially exit.
    cli.error(err.message || err);
    if (fatal) {
      return cli.exit();
    }
  };

  return {
    cli,
    options,
    getPortfolio,
    savePortfolio,
    getSymbol,
    error,
    chalk
  };
};
