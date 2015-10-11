'use strict';

var path = require('path');
var root = path.dirname(__dirname);
var self = require(path.join(root, 'package.json'));
var cli = require('cli');
var usr = require('user-settings-dir');
var defaults = {
  portfolio: path.join(usr(), 'portfolio.json'),
  interactive: false
};

cli.enable('help', 'version', 'status');
cli.setApp('stocks', self.version);
cli.parse({
  portfolio: ['p', 'The portfolio location', 'file', defaults.portfolio],
  interactive: ['i', 'Interact with stocks', 'boolean', defaults.interactive]
});

cli.main(function(args, options) {
  var tools = require('./tools')(cli, options);
  cli.debug('args: ' + JSON.stringify(args));
  cli.debug('options: ' + JSON.stringify(options));
  cli.debug('no_color: ' + cli.no_color);
  cli.debug('version: ' + self.version);

  // Determine if this terminal supports color.
  tools.chalk.enabled = (!Boolean(cli.no_color));
  var _color = (Boolean(cli.no_color))
    ? 'no_color'
    : 'color';

  tools.analytics
    // Track the entry page.
    .pageview('index')
    // Track the program version.
    .event('version', String(self.version))
    // Track the terminal color options.
    .event('color', _color)
    .send();

  // The core stocks program modes.
  if (options.interactive) {
    tools.error('Interactive mode is NYI', true);
  }
  else {
    require('./display')(tools);
  }

  process.on('uncaughtException', function(err) {
    // Track the error for bug fixes.
    tools.analytics.exception((err.message || err), 'true').send();
    tools.error((err.message || err), true);
  });
});
