# Stocks

Stocks is a Node CLI tool for tracking your Stock Portfolio.

All contributions are welcome! This is an open source project under the MIT license, see [LICENSE.md](LICENSE.md) for
additional information.

### Roadmap

 - [x] View a list of stocks
 - [x] Add new stocks via cli tool
 - [x] Add cli help
 - [x] Add external portfolio support
 - [ ] Track dividend reimbursements
 - [ ] Have configurable time periods for change $/%
 - [ ] Interactively manage stocks
 - [ ] Your idea here?

#### Installation
```bash
npm i -g stocks
```

#### Usage
```bash
$ stocks -help
Usage:
  stocks [OPTIONS] [ARGS]

Options:
  -p, --portfolio [FILE] The portfolio location (Default is /<home path>/portfolio.json)
  -i, --interactive BOOL Interact with stocks
  -a, --add STRING       Add a stock to the portfolio with a inline csv:
                         symbol,shares,price[,m/d/y date]
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
  Symbol  Name                     Ask     Bid  Change %  Change $  Shares  G/L $   Total $
  TSLA    Tesla Motors, Inc.    208.85  208.25      0.13      0.27     100  27.00  20885.00

  Cash                                                                                 0.00
  Total                                                                     27.00  20885.00
```

#### Contact
  - Author: Zack Urben
  - Twitter: https://twitter.com/zackurben (better)
  - Contact: zackurben@gmail.com

