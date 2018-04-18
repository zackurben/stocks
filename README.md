# Stocks

Stocks is a Node CLI tool for tracking your Stock Portfolio.

All contributions are welcome! This is an open source project under the MIT license, see [LICENSE.md](LICENSE.md) for
additional information.

#### Installation
```bash
npm i -g stocks
```

#### Usage
```bash
$ stocks --help
Usage:
  stocks [OPTIONS] [ARGS]

Options:
  -p, --portfolio [FILE] The portfolio location (Default is /<home path>/portfolio.json)
  -a, --add STRING       Add a stock to the portfolio from CSV string:
                         symbol,shares,price[,m/d/y purchase date]
  -r, --research STRING  Research one or multiple stocks without adding them
                         to the portfolio from CSV string: stock1,stock2
  -k, --no-color         Omit color from output
      --debug            Show debug information
  -v, --version          Display the current version
  -h, --help             Display help and usage details
```

##### Add a Stock to Your Portfolio
```bash
$ stocks -a TSLA,100,249.97,04/20/2016
```

##### View Your Saved Portfolio
```bash
$ stocks
Symbol  Name            Price  Shares      Cost     Value  Daily G/L $  Total G/L $
TSLA    Tesla, Inc.    293.35     100  24997.00  29335.00      -758.00      4338.00

Total                                  24997.00  29335.00      -758.00      4338.00
```

##### Research a Stock
```bash
$ stocks -r f
Symbol  Name                  Price  Daily G/L $
F       Ford Motor Company    11.33        -0.10
```

#### Contact
  - Author: Zack Urben
  - Twitter: https://twitter.com/zackurben (better)
  - Contact: zackurben@gmail.com

