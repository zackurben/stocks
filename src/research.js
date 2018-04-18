'use strict';

const Grid = require('term-grid');

module.exports = (tools, stocks) => {
  const { format, color } = tools;

  tools.cli.debug(stocks);
  const search = stocks
    .toString()
    .split(',')
    .map(i => i.trim().toUpperCase());

  Promise.all(search.map(tools.getSymbol))
    .then(data => {
      // Build the data grid for all the stocks in the portfolio.
      const output = [
        ['Symbol', 'Name', 'Price', 'Daily G/L $'].map(label =>
          tools.chalk.underline.bold(label)
        )
      ];

      data.forEach(({ symbol, name, currentPrice, previousClose }) => {
        // Build the data grid row.
        output.push([
          symbol,
          name,
          format(currentPrice),
          color(format(currentPrice - previousClose))
        ]);
      });

      output.push(['', '', '', '']);

      // Build and render the data grid before exiting.
      let grid = new Grid(output);
      grid.setAlign(['left', 'left', 'right', 'right']);
      grid.draw();
    })
    .catch(err => {
      tools.cli.debug(err);
      tools.cli.debug(err.stack);
      return tools.cli.error(
        `Unknown stock${search.length === 1 ? '' : 's'} ${search.join(', ')}`
      );
    });
};
