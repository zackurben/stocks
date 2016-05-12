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

##### View Your Saved Portfolio
```bash
$ stocks
```

##### Add a Stock to Your Portfolio
```bash
$ stocks -a TSLA,100,249.97,04/20/2016
```

#### Contact
  - Author : Zack Urben
  - Contact: zackurben@gmail.com
  - Twitter: twitter.com/zackurben (better)

