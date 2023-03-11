import GradientCard from "@components/ui/GradientCard";
import React, { useEffect, useState } from "react";
import useTestMarket, { ParsedOrder } from "src/hooks/useTestMarket";

type Props = {};

const OpenOrders = (props: Props) => {
  const { openOrders, eventQ } = useTestMarket();

  return (
    <GradientCard cls="col-span-4">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-200 ">
          <thead className="text-xs text-gray-200 uppercase bg-gray-900 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Open Orders
              </th>
              <th scope="col" className="px-6 py-3">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {openOrders
              .filter((item) => item.price !== "0.00")
              ?.map((item, idx) => (
                <OpenOrderItem
                  data={item}
                  key={`order-${item?.orderId.toString()}`}
                />
              ))}
          </tbody>
        </table>
      </div>
    </GradientCard>
  );
};

export const OpenOrderItem = ({ data }: { pdata: ParsedOrder }) => {
  const [finalize, setFinalize] = useState(false);

  const { eventQ } = useTestMarket();

  const canFinalize = async () => {
    try {
      if (!eventQ) throw new Error("No event queue found");
      const order = await eventQ.find((item) => item?.orderId === data.orderId);
      console.log(order)
      if (!order) throw new Error("No order found!");
      if (
        Number(order?.nativQtyPaid) > 0 &&
        Number(order?.nativeQtyReleased) > 0
      ) {
        setFinalize(true);
      }
      setFinalize(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (eventQ.length > 0) canFinalize();
  }, [eventQ]);

  return (
    <tr className=" border-b border-gray-700">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-400 whitespace-nowrap "
      >
        {/* <div className="p-1 px-2 rounded-md bg-red-600 text-white font-semibold max-w-min ">ASK</div> */}
        <div className="p-1 px-2 rounded-md bg-green-600 text-white font-semibold max-w-min ">
          BID
        </div>
      </th>
      <td className="px-6 py-4">{data?.qty}</td>
      <td className="px-6 py-4">{data?.price}</td>
      <td className="px-6 py-4 text-right">
        {
          <button
            disabled={finalize}
            className="px-2 py-1 bg-purple-500 rounded font-medium disabled:opacity-50"
          >
            Finalize
          </button>
        }
      </td>
    </tr>
  );
};
export default OpenOrders;
