'use strict';

const Grid = require('term-grid');
let grid = null;

module.exports = tools => {
  /**
   * Format a number for nice table outputs.
   *
   * @param num {String|Number}
   *   Convert a value to its number representation with 2 decimal places.
   * @returns {string}
   */
  const format = num => Number(num).toFixed(2);

  /**
   * Wrap the given number in a tools.chalk color
   *
   * @param num {Number}
   *   The Number to wrap, based upon is +/- value.
   * @returns {*}
   */
  const color = num =>
    num < 0 ? tools.chalk.black.bgRed(num) : tools.chalk.black.bgGreen(num);

  const labels = [
    'Symbol',
    'Name',
    'Price',
    'Shares',
    'Cost',
    'Total $',
    'G/L $'
  ].map(label => tools.chalk.underline.bold(label));

  tools.getPortfolio().then(portfolio => {
    Promise.all(Object.keys(portfolio.stocks).map(tools.getSymbol))
      .then(data => {
        // Build the data grid for all the stocks in the portfolio.
        const output = [labels];
        let grandTotal = 0;
        let grandCost = 0;

        data.forEach(({ symbol, name, currentPrice }) => {
          let total = 0;
          let cost = 0;
          let count = 0;
          const orders = portfolio.stocks[symbol].orders;
          orders.forEach(({ shares, price }) => {
            total += shares * currentPrice;
            cost += shares * price;
            count += shares;
          });

          // Update the global amounts.
          grandTotal += total;
          grandCost += cost;

          // Build the data grid row.
          output.push([
            symbol,
            name,
            format(currentPrice),
            count,
            format(cost),
            format(total),
            color(format(total - cost))
          ]);
        });

        // Add the Money/running total to the data grid.
        const cash =
          portfolio.hasOwnProperty('money') &&
          portfolio.money.hasOwnProperty('usd') &&
          portfolio.money.usd
            ? Number(portfolio.money.usd)
            : 0;
        output.push(['', '', '', '', '', '', '']);
        output.push(['Cash', '', '', '', '', '', format(cash)]);
        output.push([
          'Total',
          '',
          '',
          '',
          format(grandCost),
          format(grandTotal),
          color(format(grandTotal - grandCost))
        ]);

        // Build and render the data grid before exiting.
        grid = new Grid(output);
        grid.setAlign([
          'left',
          'left',
          'right',
          'right',
          'right',
          'right',
          'right'
        ]);
        grid.draw();
      })
      .catch(err => {
        // Return a nice message if the portfolio is empty.
        if (Object.keys(portfolio.stocks).length === 0) {
          return tools.cli.error('No stocks configured for display.');
        }

        return tools.error(err, true);
      });
  });
};
