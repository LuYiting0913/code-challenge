interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance{
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
    return balances.filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        return (balancePriority > -99) && (balance.amount <= 0) 
      }).sort((leftHandSide: WalletBalance, rightHandSide: WalletBalance) => { 
        const leftPriority = getPriority(leftHandSide.blockchain);
        const rightPriority = getPriority(rightHandSide.blockchain);

        return rightPriority - leftPriority;
    });
  }, [balances, prices, getPriority]); 

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    let usdValue: number | null = null;

    if (prices && balance.currency && prices[balance.currency] !== undefined) {
      usdValue = prices[balance.currency] * balance.amount;
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
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}