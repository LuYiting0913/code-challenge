import React from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, RadioGroup, Radio} from "@nextui-org/react";

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
        throw new Error('Error fetching prices: ' + error);
        }
    };
}
  

  
const TokenTable  = () => {
    const [prices, setPrices] = React.useState([]);

    React.useEffect(() => {
        const fetchPrices = async () => {
            try {
                const datasource = new Datasource("https://interview.switcheo.com/prices.json");
                const price = await datasource.getPrices();

                setPrices(price);
            } catch (error) {
                console.error("Error fetching priced from the url: " + error); 
            }
        }
        
        fetchPrices();
    }, []);

    React.useEffect(()=> {
        console.log(prices);
    }, [prices]);

  
    return (
    <div className="w-full flex flex-col gap-3 justify-center items-center">
        <Table 
            color="warning"
            selectionMode="single" 
            className="w-2/3 flex-col"
        >
          <TableHeader>
            <TableColumn>CURRENCY</TableColumn>
            <TableColumn>PRICE</TableColumn>
            <TableColumn>DATE</TableColumn>
          </TableHeader>
          <TableBody>
            {prices.map((price: any, index: any) => (
                <TableRow key={index}>
                    <TableCell>{price.currency}</TableCell>
                    <TableCell>${price.price.toFixed(2)}</TableCell>
                    {/* Assuming date is included in the price object */}
                    <TableCell>{price.date}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
    );
}

export default TokenTable;