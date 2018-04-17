'use strict';

const path = require('path');
const cli = require('cli');
const usr = require('user-settings-dir');
const root = path.dirname(__dirname);
const self = require(path.join(root, 'package.json'));
const defaults = {
  portfolio: path.join(usr(), 'portfolio.json'),
  interactive: false,
  add: false
};

cli.enable('help', 'version', 'status');
cli.setApp('stocks', self.version);
cli.parse({
  portfolio: ['p', 'The portfolio location', 'file', defaults.portfolio],
  add: [
    'a',
    'Add a stock to the portfolio from CSV string: symbol,shares,price[,m/d/y purchase date]',
    'string',
    defaults.add
  ]
});
cli.main((args, options) => {
  cli.debug(`args: ${JSON.stringify(args)}`);
  cli.debug(`options: ${JSON.stringify(options)}`);
  cli.debug(`no_color: ${cli.no_color}`);
  cli.debug(`version: ${self.version}`);

  const tools = require('./tools')(cli, options);
  if (options.add) {
    return require('./add')(tools, options.add);
  }

  cli.error('No action given!', true);
  process.on('uncaughtException', err => {
    tools.error(err.message || err, true);
  });
});
