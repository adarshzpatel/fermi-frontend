import React from 'react'
import { FiTrendingUp } from 'react-icons/fi';

type Props = {}

const OrderBookRow = () => {
  return (
    <div className="grid grid-cols-4 gap-4 text-xs leading-8 ">
      <div>00.00</div>
      <div className="text-right text-green-500">00.00</div>
      <div className="text-left text-red-400">00.00</div>
      <div className="text-right">00.00</div>
    </div>
  );
};
const Orderbook = (props: Props) => {
  return (
    <div className="p-4 border border-gray-700 rounded-lg">
    <div className="pb-4 font-bold text-center text-xl flex justify-between">
      Orderbook
      <div className="text-green-500 flex items-center justify-center gap-2  ">
        <FiTrendingUp className="h-6 w-6" />
        30.46
      </div>
    </div>
    <div className="flex items-center font-bold justify-between text-sm mt-2 text-gray-500">
      <div>Price(SOL)</div>
      <div>Price(USDC)</div>
      <div>Price(SOL)</div>
    </div>
      <OrderBookRow/>
      <OrderBookRow/><OrderBookRow/><OrderBookRow/><OrderBookRow/><OrderBookRow/>
      <OrderBookRow/>
      <OrderBookRow/>
      <OrderBookRow/>
  </div>
  )
}

export default Orderbook