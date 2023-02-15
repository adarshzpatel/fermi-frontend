import React, { useState } from "react";

type Props = {};
import BuySell from "@components/trade/BuySell";
import TradingChart from "@components/trade/TradingChart";
import Orderbook from "@components/trade/Orderbook";
import DetailsRow from "@components/trade/DetailsRow";



const Trade = (props: Props) => {
  const [pair, setPair] = useState<string>("SOL/USDT");
  return (
    <div>
      <div className="mb-4 border-gray-700">
        <DetailsRow/>
      </div>
      <div className="grid gap-4 grid-cols-4">
        <div className="col-span-3 grid grid-cols-3 gap-4">
        <BuySell/>
        <TradingChart/>
      <div className="col-span-3 border p-4 border-gray-700">
        {/* ORDERS / POSITIONS */}
      </div>
        </div>
        <Orderbook/>
      </div>
      {/* <PairSelector value={pair} onChange={setPair} />       */}
    </div>
  );
};

export default Trade;
