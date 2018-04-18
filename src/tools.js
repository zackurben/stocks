'use strict';

const path = require('path');
const Chalk = require('chalk');
const fs = require('fs');
const yahoo = require('yahoo-stocks');

module.exports = (cli, options) => {
  // Force chalk to use our color settings.
  const chalk = new Chalk.constructor({ enabled: cli.no_color === false });

  /**
   * Get the user portfolio.
   *
   * @returns {Promise}
   */
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

  /**
   * Save the user portfolio.
   *
   * @param {Object} portfolio
   *   The portfolio to save.
   *
   * @returns {Promise}
   */
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

  /**
   * Lookup a security by its symbol.
   *
   * @param {String} symbol
   *   The securities exchange symbol.
   *
   * @returns {Promise}
   */
  const getSymbol = symbol =>
    Promise.all([yahoo.lookup(symbol), yahoo.history(symbol)]).then(
      ([lookup, history]) => Object.assign({}, lookup, history)
    );

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
