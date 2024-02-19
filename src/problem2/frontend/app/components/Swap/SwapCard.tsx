import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Button} from "@nextui-org/react";
import Image from 'next/image';
import SwitchPic from '../../images/SwitchPicture.png';

import { toast } from 'react-toastify';
import CurrencySelectTable from "./CurrencySelectTable";

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
  
const SwapCard = () => {
    const [currencyNames, setCurrencyNames] = React.useState<string[]>([]);
    const [currencies, setCurrencies] = React.useState<{ [key: string]: number }>({});
    const [currencyOwned, setCurrencyOwned] = React.useState<{ [key: string]: number }>({});
    const [prices, setPrices] = React.useState([]);
    const [origin, setOrigin] = React.useState("Select currency");
    const [target, setTarget] = React.useState("Select currency");
    const [targetAmount, setTargetAmount] = React.useState<number>(0);
    const [originAmount, setOriginAmount] = React.useState<number>(0);

    const [selectForOrigin, setSelectForOrigin] = React.useState<boolean>(false);
    const [selectedCurrencyInModal, setSelectedcurrecyInModal] = React.useState<string>("");

    const {isOpen, onOpen, onClose} = useDisclosure();
    const TARGET = 'TARGET';
    const ORIGIN = 'ORIGIN';

    const handleModalOpen = (selectFor : string) => {
        setSelectForOrigin(selectFor == ORIGIN);
        onOpen();
    }

    const handleModalClose = () => {
        onClose();
        if (selectForOrigin) {
            setOrigin(selectedCurrencyInModal);
        } else {
            setTarget(selectedCurrencyInModal);
        }
    }
  

    // const showModal = () => {
    //     setIsModalOpen(true);
    //   };
    
    //   const closeModal = () => {
    //     setIsModalOpen(false);
    //   };

    const swapOriginAndTarget = () => {
        const oldOrigin = origin;
        const oldOriginAmount = originAmount;
        const oldTargetAmount = targetAmount;
        setOrigin(target);
        setTarget(oldOrigin);
        setTargetAmount(oldOriginAmount);
        setOriginAmount(oldTargetAmount);

        toast.success("Switched the currencies!")
    }

    const initializeCurrency = () => {
        const currencyNames : string[] = prices.map((price: any) => price.currency); 
        const currencyValues: { [key: string]: number } = prices.reduce((acc: { [key: string]: number }, price: any) => {
            acc[price.currency] = price.price;
            return acc;
        }, {});
        const currencyOwned: { [key: string]: number } = {};
        currencyNames.forEach((currency : string) => {
            currencyOwned[currency] = 1000; // initialize with 1000 each 
        });
        
        setCurrencies(currencyValues);
        setCurrencyNames(currencyNames);
        setCurrencyOwned(currencyOwned);
    }

    const getOwned = (currency : string) => {
        if (! (currency in currencies)) {
            return 0;
        }
        return currencyOwned[currency];
    }

    const getExchangedAmount = (origin:string, originAmount:number, target:string) => {
        const originPrice = currencies[origin];
        const targetPrice = currencies[target];
        const exchangeRate = targetPrice / originPrice;

        return originAmount * exchangeRate;
    }

    const calculateExchangeAmount = () => {
        if (!(origin in currencies) || !(target in currencies)) {
            toast.error('Please select the currencies you wish to swap.');
            return;
        }

        const targetValue = getExchangedAmount(origin, originAmount, target);
        setTargetAmount(targetValue);
        return targetValue;

    }

    const makeTransaction = () => {
        if (!(origin in currencies) || !(target in currencies)) {
            toast.error('Please select the currencies you wish to swap.');
            return;
        }
        
        if (originAmount > getOwned(origin)) {
            toast.error('You do not own that much.');
            return;
        }


        //make transaction
        const targetValue = calculateExchangeAmount();
        if (!targetValue) {
            toast.warning('Swap value cannot be 0. Try again!');
            return;
        }
        currencyOwned[origin] -= originAmount;
        currencyOwned[target] += targetValue;
        setOriginAmount(0);
        setTargetAmount(0);
        toast.success('Transaction successful!');
    }


    // React.useEffect(() => {
    //     setOriginAmount(0);
    //     // setTargetAmount(0);
    // }, [origin]);

    // React.useEffect(() => {
    //     // setOriginAmount(0);
    //     setTargetAmount(0);
    // }, [target]);

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
        initializeCurrency(); // for testing purpose, top up wallet when each time prices are reloaded
    }, [prices]);

    const currencySelectModal = (      
        <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex flex-col gap-1">Select the currency</ModalHeader>
                <ModalBody>
                    <CurrencySelectTable currencies={currencyNames} onSelect={(currency : string) => setSelectedcurrecyInModal(currency)}></CurrencySelectTable>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onPress={() => handleModalClose()}>
                        Confirm
                    </Button>
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>
    );


    return (
        <div className="flex w-full grid grid-cols-8 gap-5">
            <div className="flex flex-wrap col-span-6 w-full">
                <div className="w-full flex gap-4 items-center mb-5 mt-5">
                    <Input
                        radius="none"
                        label="You pay"
                        placeholder="0.00"
                        labelPlacement="inside"
                        isInvalid={originAmount > getOwned(origin)}
                        color={(originAmount > getOwned(origin)) ? "danger" : "default"} 

                        errorMessage={(originAmount > getOwned(origin)) ? "Exceeds the amount you owned":""} 
                        description={`you own ${getOwned(origin)}`}
                        value={`${originAmount ? originAmount : 0}`}
                        onValueChange={(newVal : string) => setOriginAmount(parseFloat(newVal))}
                        endContent={
                            <Button  
                                key="origin-modal"
                                variant="light" 
                                color="default" 
                                onPress={() => handleModalOpen(ORIGIN)}
                                className="capitalize flex mb-4"
                                >
                                {origin}
                            </Button>
                        }
                    />
                </div>      

                <div className="w-full flex gap-4 items-center mb-5">
                    <Input
                        radius="none"
                        label="You will receive"
                        placeholder="0.00"
                        labelPlacement="inside"
                        color="success" 
                        disabled={true}
                        description={`you own ${getOwned(target)}`}
                        value={`${targetAmount ? targetAmount : 0}`}
                        onValueChange={(newVal : string) => setTargetAmount(parseFloat(newVal))}
                        endContent={
                            <Button  
                                key="origin-modal"
                                variant="light" 
                                color="success"
                                // color="default" 
                                onPress={() => handleModalOpen(TARGET)}
                                className="capitalize flex mb-4"
                                >
                                {target}
                            </Button>
                        }
                    />
            
                </div>    
                <div className="w-full flex gap-4 items-center mb-5">
                    <Button 
                        className="w-full flex justify-center m-auto" 
                        color="warning"
                        radius="none"
                        variant="ghost"
                        onClick={calculateExchangeAmount} 
                    >Calculate</Button>
                    {/* <Button
                        className="w-1/5 flex justify-center m-auto" 
                        color="default"
                        variant="solid"
                    >
                        <Image 
                            className="m-1"
                            src={SwitchPic} 
                            alt="SwitchPicture" 
                        />

                    </Button> */}
                    <Button 
                        className="w-full flex justify-center m-auto" 
                        color="success"
                        radius="none"
                        variant="ghost"

                        onClick={makeTransaction} 
                    >Make transaction</Button>
                </div>    
                {currencySelectModal}

            </div>
            <div className="flex flex-wrap col-span-2 w-full h-1/2 mt-8">
                <Button
                    className="w-0.5 flex justify-center m-auto p-5" 
                    color="default"
                    variant="solid"
                    radius="lg"
                    onClick={swapOriginAndTarget}
                >
                    <Image 
                        className="m-2"
                        src={SwitchPic} 
                        alt="SwitchPicture" 
                    />

                </Button>
            </div>
        </div>
    );
}

export default SwapCard;
