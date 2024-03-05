interface WalletBalance {
  currency: string;
  amount: number;
}
// formatted wallet balance share 2 attributes with wallet balance, it should inherits from the interface
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

class Datasource {
  private url : string;
  constructor(url : string) {
    this.url = url;
  }

  getPrices = async () => {
    try {
      const response = await fetch(this.url);
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const prices = await response.json();
      return prices;
    } catch (error) {
      throw new Error('Error fetching prices: ' + error.message);
    }
  };
}

interface Props extends BoxProps {
// any additional fields here?
}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const datasource = new Datasource("https://interview.switcheo.com/prices.json");
    datasource.getPrices().then(prices => { // should be async and wait for the response
      setPrices(prices);
    }).catch(error => {
      console.err(error); // logged error not informative
    });
  }, []);

  const getPriority = (blockchain: any): number => { // use of magic numbers and unclear why the numbers are chosen.
    // also violates separation of concerns.
    switch (blockchain) {
      case 'Osmosis':
        return 100
      case 'Ethereum':
        return 50
      case 'Arbitrum':
        return 30
      case 'Zilliqa':
        return 20
      case 'Neo':
        return 20
      default:
        return -99
    }
  }

  const sortedBalances = useMemo(() => {
    // return statement too long 
    return balances.filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
          if (lhsPriority > -99) { // magic number of -99 and lhs priority not defined
              if (balance.amount <= 0) { // arrow-headed if statements
                return true; // redundant logic
              }
          }
          return false // redundant logic
        }).sort((lhs: WalletBalance, rhs: WalletBalance) => { // lhs rhs may be hard to understand
          const leftPriority = getPriority(lhs.blockchain);
          const rightPriority = getPriority(rhs.blockchain);
          if (leftPriority > rightPriority) { // redundant comparison logic
            return -1;
          } else if (rightPriority > leftPriority) {
            return 1;
          }
    });
  }, [balances, prices]); // missing dependency of getPriority
  // sidenote: the sorted balance is of type balance, instead of formatted balance. need to reformat.

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  }) 

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount; // need to handle null pionter or invalid pointer
    // would be nice to separate the calculation.
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}> 
      {rows}
    </div>
  )
}