import React, { useEffect, useState } from "react";

type Props = {};
import BuySell from "@components/trade/BuySell";
import TradingChart from "@components/trade/TradingChart";
import Orderbook from "@components/trade/Orderbook";
import DetailsRow from "@components/trade/DetailsRow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/Tabs";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";


const Trade = (props: Props) => {
  const [pair, setPair] = useState<string>("SOL/USDT");  
  
  return (
    <div>
      <div className="mb-4 border-gray-700">
        <DetailsRow />
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        <div className="lg:col-span-3 grid lg:grid-cols-3 gap-4">
          <BuySell />
          <TradingChart />
          <div className="col-span-3 border p-4 border-gray-700 rounded-lg">
            {/* ORDERS / POSITIONS */}
            <Tabs defaultValue="balances">
              <TabsList className="justify-around w-full">
                <TabsTrigger className="w-full" value="balances">
                  Balances
                </TabsTrigger>
                <TabsTrigger className="w-full" value="orders">
                  Orders
                </TabsTrigger>
                <TabsTrigger className="w-full" value="positions">
                  Positions
                </TabsTrigger>
                <TabsTrigger className="w-full" value="history">
                  Trade History
                </TabsTrigger>
              </TabsList>
              <TabsContent value="balances">
                Connect Wallet to see balance
              </TabsContent>
              <TabsContent value="orders">
                Connect Wallet to see orders
              </TabsContent>
              <TabsContent value="positions">
                Connect Wallet to see positions
              </TabsContent>{" "}
              <TabsContent value="history">
                Connect Wallet to see trade history
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <Orderbook />
      </div>
    </div>
  );
};

export default Trade;
