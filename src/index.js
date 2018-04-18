'use strict';

const path = require('path');
const cli = require('cli');
const usr = require('user-settings-dir');
const root = path.dirname(__dirname);
const self = require(path.join(root, 'package.json'));
const defaults = {
  portfolio: path.join(usr(), 'portfolio.json'),
  add: false
};

process.on('uncaughtException', err => {
  cli.debug(err.message || err);
  cli.debug(err.stack || JSON.stringify(err));
  cli.error(err.message || err);
});

cli.enable('help', 'version', 'status');
cli.setApp('stocks', self.version);
cli.parse({
  portfolio: ['p', 'The portfolio location', 'file', defaults.portfolio],
  add: [
    'a',
    'Add a stock to the portfolio from CSV string: symbol,shares,price[,m/d/y purchase date]',
    'string',
    defaults.add
  ],
  research: [
    'r',
    'Research one or multiple stocks without adding them to the portfolio from CSV string: stock1,stock2',
    'string'
  ]
});
cli.main((args, options) => {
  const tools = require('./tools')(cli, options);
  cli.debug(`args: ${JSON.stringify(args)}`);
  cli.debug(`options: ${JSON.stringify(options)}`);
  cli.debug(`no_color: ${cli.no_color}`);
  cli.debug(`version: ${self.version}`);

  if ((args && args.length) || options.research) {
    return require('./research')(
      tools,
      args && args.length ? args.shift() : options.research
    );
  }

  if (options.add) {
    return require('./add')(tools, options.add);
  }

  return require('./display')(tools);
});
