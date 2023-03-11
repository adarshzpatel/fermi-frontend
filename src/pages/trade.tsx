import React, { useEffect, useState } from "react";

type Props = {};
import BuySell from "@components/trade/BuySell";
import TradingChart from "@components/trade/TradingChart";
import Orderbook from "@components/trade/Orderbook";
import DetailsRow from "@components/trade/DetailsRow";
import {
  useWallet,
} from "@solana/wallet-adapter-react";
import OpenOrders from "@components/trade/OpenOrders";

const Trade = (props: Props) => {
  const [pair, setPair] = useState<string>("SOL/USDT");
  const { publicKey } = useWallet();

  if (!publicKey) {
    return (
      <div className="flex items-center h-[calc(100vh-8rem)] text-fuchsia-400 justify-center text-4xl font-semibold">
        Please connect wallet first !!
      </div>
    );
  
  }
  return (
    <div>
      <div className="mb-4 border-gray-700">
        <DetailsRow />
      </div>
      <div className="grid grid-cols-4 gap-4">
          <BuySell />
          <TradingChart />
          <Orderbook />
          <OpenOrders />
      </div>
    </div>
  );
};

export default Trade;
