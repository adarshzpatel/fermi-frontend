import React, { useEffect, useState } from "react";

type Props = {};
import BuySell from "@components/trade/BuySell";
import TradingChart from "@components/trade/TradingChart";
import Orderbook from "@components/trade/Orderbook";
import DetailsRow from "@components/trade/DetailsRow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/Tabs";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import OpenOrders from "@components/trade/OpenOrders";

const Trade = (props: Props) => {
  const [pair, setPair] = useState<string>("SOL/USDT");
  const { publicKey } = useWallet();

  if (!publicKey) {
      return <div className="flex items-center h-[calc(100vh-8rem)] text-fuchsia-400 justify-center text-4xl font-semibold">
        Please connect wallet first !!
      </div>
  }
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
            <Tabs defaultValue="orders">
              <TabsList className="justify-around w-full">
                {/* <TabsTrigger className="w-full" value="balances">
                  Balances
                </TabsTrigger> */}
                <TabsTrigger className="w-full" value="orders">
                 Open Orders
                </TabsTrigger>
                {/* <TabsTrigger className="w-full" value="history">
                  Trade History
                </TabsTrigger> */}
              </TabsList>
              {/* <TabsContent value="balances">
                Connect Wallet to see balance
              </TabsContent> */}
              <TabsContent value="orders">
              <OpenOrders />
              </TabsContent>
              {/* <TabsContent value="history">
                Connect Wallet to see trade history
              </TabsContent> */}
            </Tabs>
          </div>
        </div>
        <Orderbook />
      </div>
    </div>
  );
};

export default Trade;
