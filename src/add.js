'use strict';

module.exports = (tools, data) => {
  // Parse the given input and fail if incorrect.
  let [symbol, shares, price, date] = data.split(',');
  if (!symbol || !shares || !price) {
    tools.cli.info(
      'Correct format for adding symbols is: symbol,shares,price[,m/d/y date]'
    );
    return tools.error(
      `Expected add to be 3-4 elements, got ${data.length} -> ${JSON.stringify(
        data
      )}`,
      true
    );
  }

  // Load the portfolio and merge the given + existing data together.
  tools.getPortfolio().then(portfolio => {
    tools.cli.debug(JSON.stringify(portfolio));
    portfolio.stocks = portfolio.stocks || {};

    symbol = String(symbol).toUpperCase();
    shares = Number(shares);
    price = Number(price);
    date = date ? String(date) : undefined;

    portfolio.stocks[symbol] = portfolio.stocks[symbol] || {};
    portfolio.stocks[symbol].orders = portfolio.stocks[symbol].orders || [];
    const temp = Object.assign(
      {
        shares,
        price
      },
      date ? { date } : {}
    );

    tools.cli.debug(JSON.stringify(temp));
    portfolio.stocks[symbol].orders.push(temp);

    // Save the portfolio.
    return tools.savePortfolio(portfolio);
  });
};
