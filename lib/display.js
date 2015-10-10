'use strict';

var _ = require('lodash');

module.exports = function(tools) {
  tools.loadPortfolio(function(data) {
    var fields = [
      's', // Symbol
      'n', // Name
      'a', // Ask
      'b'  // Bid
    ];

    tools.loadTicker(Object.keys(data.stocks), fields, function(err, data) {
      if (err) {
        tools.cli.error(err);
        tools.cli.exit();
      }

      tools.cli.output(data);
      tools.cli.exit();
    });
  });
};
