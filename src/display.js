'use strict';

const Grid = require('term-grid');

module.exports = tools => {
  /**
   * Format a number for nice table outputs.
   *
   * @param num {String|Number}
   *   Convert a value to its number representation with 2 decimal places.
   *
   * @returns {String}
   *   The formatted number.
   */
  const format = num => Number(num).toFixed(2);

  /**
   * Wrap the given number in a tools.chalk color
   *
   * @param num {Number}
   *   The Number to wrap, based upon is +/- value.
   *
   * @returns {String}
   *   The color formatted number.
   */
  const color = num =>
    num < 0 ? tools.chalk.black.bgRed(num) : tools.chalk.black.bgGreen(num);

  tools.getPortfolio().then(portfolio => {
    Promise.all(Object.keys(portfolio.stocks).map(tools.getSymbol))
      .then(data => {
        // Build the data grid for all the stocks in the portfolio.
        const output = [
          ['Symbol', 'Name', 'Price', 'Shares', 'Cost', 'Value', 'Daily G/L $', 'Total G/L $'].map(
            label => tools.chalk.underline.bold(label)
          )
        ];
        let grandTotal = 0;
        let grandCost = 0;
        let grandDaily = 0;

        data.forEach(({ symbol, name, currentPrice, previousClose }) => {
          let total = 0;
          let cost = 0;
          let count = 0;
          let daily = 0;
          const orders = portfolio.stocks[symbol].orders;
          orders.forEach(({ shares, price }) => {
            total += shares * currentPrice;
            cost += shares * price;
            count += shares;
            daily += (currentPrice - previousClose) * shares;
          });

          // Update the global amounts.
          grandTotal += total;
          grandCost += cost;
          grandDaily += daily;

          // Build the data grid row.
          output.push([
            symbol,
            name,
            format(currentPrice),
            count,
            format(cost),
            format(total),
            color(format(daily)),
            color(format(total - cost))
          ]);
        });

        output.push(
          ['', '', '', '', '', '', '', ''],
          [
            'Total',
            '',
            '',
            '',
            format(grandCost),
            format(grandTotal),
            color(format(grandDaily)),
            color(format(grandTotal - grandCost))
          ]
        );

        // Build and render the data grid before exiting.
        let grid = new Grid(output);
        grid.setAlign([
          'left',
          'left',
          'right',
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
