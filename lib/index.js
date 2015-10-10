'use strict';

var path = require('path');
var cli = require('cli');
var defaults = {
  portfolio: path.join(__dirname, 'portfolio.json')
};

cli.parse({
  portfolio: ['p', 'The portfolio location', 'file', defaults.portfolio]
});

cli.main(function(args, options) {
  console.log(args);
  console.log(options);
});
