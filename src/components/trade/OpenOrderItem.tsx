import { OpenOrderItem, OrderItem } from "@components/contexts/types";
import { useEffect, useMemo, useState } from "react";
import { useGlobalState } from "src/hooks/useGlobalState";
import * as anchor from "@project-serum/anchor";
import { eventQPda, marketPda } from "@utils/constants";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

export const OpenOrdersItem = ({ id }: { id: string }) => {
  const [finalisable, setFinalisable] = useState(false);
  const [cptyEvent,setCptyEvent] = useState<any>({})
  const { eventQ,bids,asks,program,finalizeOrder } = useGlobalState();
  const {publicKey:connectedPublicKey} = useWallet()

  const data = useMemo(()=>{
    // match the openorder id to bids / asks
    const bidMatch = bids?.find((it:any) => it?.orderId === id);
    if(bidMatch?.orderId) return {price:bidMatch?.price,qty:bidMatch?.qty,type:"Bid"}
    const askMatch = asks?.find((it:any) => it?.orderId === id);
    if(askMatch?.orderId) return {price:askMatch.price,qty:askMatch?.qty,type:"Ask"}
    return undefined
  },[bids,asks,id])

  useEffect(()=>{
    // check if it is finalizable or not
    eventQ?.forEach((event:any) => {
      //const isValidMatch = event['maker'] === 'true' || event['cpty_orderid'] !== undefined
      const isValidMatch = true
      if(isValidMatch){
        const isFinalisable = event['cpty_orderid'] === id //|| event['orderid'] === id
        //const isFinalisable = false
        console.log(event['cpty_orderid'])
        if(isFinalisable) {
          console.log("FINALISE NOW!!!")
          setFinalisable(true)
          setCptyEvent(event)
        }
      }
    });
  },[eventQ,id])

  if(!data){
    return <></>
  }


  const handleFinalize = async () => {
    try {
      if (!eventQ) throw new Error("No event queue found");
      if(!connectedPublicKey ) throw new Error("No connected wallet found !")
      // get owner_slot from the open orders index
      // get event_slot from eventQ
      let owner_slot
      let cpty_event_slot;

      let openOrdersPda;
      let openOrdersPdaBump;

      [openOrdersPda,openOrdersPdaBump] = await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from("open-orders", "utf-8"),
            new anchor.web3.PublicKey(marketPda).toBuffer(),
            connectedPublicKey?.toBuffer(),
          ],
          program?.programId
        );


      const open_orders = await program.account.openOrders.fetch(
          openOrdersPda
      );

      open_orders.orders.forEach((element:anchor.BN,oo_index:number) => {
        // find the matched order in oo and set owner_slot
        if(cptyEvent['cpty_orderid'] === element.toString()){
          owner_slot = oo_index
        }
      });

      if(!owner_slot) throw new Error("No owner_slot found!")
      await finalizeOrder(owner_slot,cptyEvent['idx'],id,new PublicKey(cptyEvent['owner']),connectedPublicKey,data.type as ("Ask" | "Bid"))

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
        disabled={!finalisable}
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
