import { OpenOrderItem, OrderItem } from "@components/contexts/types";
import { useEffect, useMemo, useState } from "react";
import { useGlobalState } from "src/hooks/useGlobalState";
import * as anchor from "@project-serum/anchor";
import { eventQPda } from "@utils/constants";

export const OpenOrdersItem = ({ id }: { id: string }) => {
  const [finalisable, setFinalisable] = useState(false);
  const { eventQ,bids,asks,program } = useGlobalState();
  
  const data = useMemo(()=>{
    console.log(bids)
    const bidMatch = bids?.find((it:any) => it?.orderId === id);
    if(bidMatch?.orderId) return {price:bidMatch?.price,qty:bidMatch?.qty,type:"Bid"}
    const askMatch = asks?.find((it:any) => it?.orderId === id);
    if(askMatch?.orderId) return {price:askMatch.price,qty:askMatch?.qty,type:"Ask"}
    return undefined
  },[eventQ,id])

  if(!data){
    return <></>
  }

  const handleFinalize = async () => {
    try {
      if (!eventQ) throw new Error("No event queue found");
      console.log("Let's finalize boi",id)
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <tr className=" border-b border-cyan-900">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-400 whitespace-nowrap "
      >
        {/* <div className="p-1 px-2 rounded-md bg-red-600 text-white font-semibold max-w-min ">ASK</div> */}
        <div
          className={` ${
            data?.type === "Ask" ? "text-red-500" : "text-green-500 "
          } p-1 px-2 rounded-md font-semibold max-w-min `}
        >
          {data.type?.toUpperCase()}
        </div>
      </th>
      <td className="px-6 py-4">{data?.qty}</td>
      <td className="px-6 py-4">{data?.price}</td>
      <td className="px-6 py-4 text-right gap-4">
        <button
        onClick={()=>console.log("Canccel")}
          className="px-2 py-1 border border-red-600 bg-red-900/25 text-red-400 hover:scale-105 duration-200 active:scale-100 rounded font-medium disabled:opacity-50"
        >
          Cancel
        </button>
      </td>
      <td className="px-6 py-4 text-right gap-4">
        <button
          onClick={handleFinalize}
          className="px-2 py-1 bg-purple-500 rounded font-medium disabled:opacity-50 hover:scale-105 duration-200 active:scale-100"
        >
          Finalize
        </button>
      </td>
    </tr>
  );
};
export default OpenOrdersItem;
