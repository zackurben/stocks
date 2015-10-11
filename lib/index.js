'use strict';

var path = require('path');
var root = path.dirname(__dirname);
var self = require(path.join(root, 'package.json'));
var cli = require('cli');
var defaults = {
  portfolio: path.join(root, 'portfolio.json'),
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
  cli.debug(JSON.stringify(args));
  cli.debug(JSON.stringify(options));
  cli.debug(cli.no_color);

  if (options.interactive) {
    cli.error('NYI');
    cli.exit();
  }
  else {
    require('./display')(tools);
  }
});
