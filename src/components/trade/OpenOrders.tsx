import React from "react";
import useTestMarket from "src/hooks/useTestMarket";

type Props = {};

const OpenOrders = (props: Props) => {
  const { openOrders } = useTestMarket();
 
  return (
    <div>
      <div className="flex border-b-2 border-b-gray-600 py-2 uppercase text-sm font-bold text-gray-400 items-center justify-between">
        <div>
        Orders
        </div>
        <div>
          Price
        </div>
      </div>
      {openOrders.filter(item => item.price !== '0.00')?.map((item, idx) => (
        <div
          className="border-b flex justify-between border-b-gray-700 p-2"
          key={`oo-${item?.orderId.toString()}`}
        >
          <div> {idx + 1} </div>
          <div>{item?.price}</div>
        </div>
      ))}
    </div>
  );
};

export default OpenOrders;
