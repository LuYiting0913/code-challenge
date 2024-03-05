interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
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
  // children : string?
}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const [prices, setPrices] = useState({});
  const BLOCKCHAIN_PRIORITIES = {
    "Osmosis": 100,
    "Ethereum": 50,
    "Arbitrum": 30,
    "Zilliqa": 20,
    "Neo": 20,
    Default: -99
  };
  
  const getPriority = (blockchain : string) => {
    return BLOCKCHAIN_PRIORITIES[blockchain] || BLOCKCHAIN_PRIORITIES.Default;
  };

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const datasource = new Datasource("https://interview.switcheo.com/prices.json");
        const prices = await datasource.getPrices();
        setPrices(prices);
      } catch (error) {
        console.error("Error fetching priced from the url: " + error); 
      }
    }
    
    fetchPrices();
  }, []);



  const sortedBalances = useMemo(() => {
    const filteredResult = balances.filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      return (balancePriority != BLOCKCHAIN_PRIORITIES.Default) && (balance.amount <= 0) 
    });

    const sortedResult = filteredResult.sort((leftHandSide: WalletBalance, rightHandSide: WalletBalance) => { 
      const leftPriority = getPriority(leftHandSide.blockchain);
      const rightPriority = getPriority(rightHandSide.blockchain);
      return rightPriority - leftPriority;
    });

    const formattedSortedResult = formattedBalances(sortedResult);

    return formattedSortedResult;
  }, [balances, prices, getPriority]); 

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  }) 

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    let exchangeRate : number = 1;
    let usdValue: number = 0;

    if (prices && balance.currency && prices[balance.currency] !== undefined) {
      exchangeRate = prices[balance.currency];
      usdValue = exchangeRate * balance.amount;
    } else {
      usdValue = 0; // assume this is the desired way to handle null pointer error
    }
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}