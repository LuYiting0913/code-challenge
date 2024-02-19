import React from "react";
import {Tabs, Tab} from "@nextui-org/react";
import SwapCard from "./SwapCard";

const SwapForm = () => {

  return (
    <div className="flex w-full flex-col">
        <Tabs key="swap-form" variant="underlined" size="md">
            <Tab key="swap" title="Swap">
                <div>
                    <SwapCard></SwapCard>
                </div>
            </Tab>
            <Tab key="buy" title="Buy">
            </Tab>
            <Tab key="tradein" title="Trade-in">
            </Tab>
        </Tabs>

    </div>
  );
}

export default SwapForm;
