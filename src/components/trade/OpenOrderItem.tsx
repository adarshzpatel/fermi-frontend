import { OpenOrderItem, OrderItem } from "@components/contexts/types";
import { useEffect, useState } from "react";
import { useGlobalState } from "src/hooks/useGlobalState";
import * as anchor from "@project-serum/anchor"
import { eventQPda } from "@utils/constants";

export const OpenOrdersItem = ({ data }: { data: OpenOrderItem }) => {
  const [finalize, setFinalize] = useState(false);
  const { eventQ,program } = useGlobalState();

  const canFinalize = async () => {
    try {
      console.log(data)
      if (!eventQ) throw new Error("No event queue found");
      const order = await eventQ.find((item) => item?.orderId === data?.orderId);

      if (!order) throw new Error("No order found!");
      console.log(Number(order?.nativeQtyPaid) > 0 )
      console.log(Number(order?.nativeQtyReleased) > 0)
    } catch (err) {
      console.log(err);
    }
  };

  const handleFinalize = async () => {
    try{
      if (!eventQ) throw new Error("No event queue found");
      const matchedEvent = await eventQ.find((item) => item?.orderId === data?.orderId);
      console.log(matchedEvent);
    
    } catch(err){
      console.log(err)
    }
  }
  useEffect(() => {
    if (eventQ && eventQ?.length > 0) canFinalize();
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
        {finalize &&
          <button
          onClick={handleFinalize}
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
export default OpenOrdersItem;
