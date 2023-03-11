import React, { useEffect, useState } from "react";
import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { priceFromOrderId, timestampFromOrderId } from "@utils/program";
import {
  asksPda,
  bidsPda,
  coinMint,
  coinVault,
  eventQPda,
  marketPda,
  pcMint,
  pcVault,
  reqQPda,
} from "@utils/constants";
import { PublicKey } from "@solana/web3.js";
import { useGlobalState } from "./useGlobalState";
import { toast } from "react-hot-toast";

export type ParsedOrder = {
  price: string;
  qty: string;
  orderId: string;
  owner?: PublicKey;
  ownerSlot?: number;
};

export type EventQueueItem = {
  nativeQtyReleased: string;
  price: number;
  nativQtyPaid: string;
  orderId: string;
};

export type OpenOrderItem = {
  price: string ,
  orderId: anchor.BN
  type:'ask' | 'bid'
  qty:string 
}

export type Balances = {
  nativeCoinFree:string 
  nativeCoinTotal:string 
  nativePcFree:string 
  nativePcTotal:string
}

const useTestMarket = () => {
  const [asks, setAsks] = useState<ParsedOrder[]>([]);
  const [bids, setBids] = useState<ParsedOrder[]>([]);
  const [openOrders, setOpenOrders] = useState<OpenOrderItem[]>([]);
  const [eventQ, setEventQ] = useState<EventQueueItem[]>([]);
  const [balances,setBalances] = useState<Balances>({} as Balances)
  const {
    publicKey: connectedPublicKey,
    signTransaction,
    sendTransaction,
  } = useWallet();
  const { program } = useGlobalState();
  const { connection } = useConnection();
  useEffect(() => {
    if (program) getBids();
  }, [program]);

  useEffect(() => {
    if (program) getAsks();
  }, [program]);

  // useEffect(() => {
  //   if (program) getOpenOrders();
  // }, [program]);

  useEffect(() => {
    if (program) getEventQ();
  }, [program]);

  useEffect(()=>{
    if(bids && asks) getOpenOrders()
  },[bids,asks])

  const getOpenOrders = async () => {
    try {
      if (!program || !connectedPublicKey)
        throw new Error("No program found!!");
      const authorityPCTokenAccount = await spl.getAssociatedTokenAddress(
        new anchor.web3.PublicKey(pcMint),
        connectedPublicKey,
        false
      );
      let openOrdersPda;
      let openOrdersPdaBump;
      [openOrdersPda, openOrdersPdaBump] =
        await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from("open-orders", "utf-8"),
            new anchor.web3.PublicKey(marketPda).toBuffer(),
            connectedPublicKey.toBuffer(),
          ],
          program.programId
        );
        const openOrdersResponse = await program.account.openOrders.fetch(
          openOrdersPda,
        );
        setBalances({
          nativeCoinFree:openOrdersResponse.nativeCoinFree.toString(),
          nativeCoinTotal:openOrdersResponse.nativeCoinTotal.toString(),
          nativePcFree:openOrdersResponse.nativePcFree.toString(),
          nativePcTotal:openOrdersResponse.nativePcTotal.toString(),
        })
        console.log(openOrdersResponse);
        let ids = openOrdersResponse?.orders.map((item)=> {

          return item.toString()
        })
        // remove zero value orders
        ids = ids.filter((item)=> item !== '0')
        // check
        console.log("open orders after removeing zero value orders",ids)
        const _orders = ids.map((orderId) => {
          try{
            let match = eventQ.find(item=>item.orderId === orderId)

            if(!match){
              // match = asks.find(item=>item.orderId === orderId)  
            }
            if(match) return match
          } catch(err){
            console.log(err)
          }
        })
        console.log(_orders)

        // console.log("order ids ",_orders)


      } catch (err) {
        console.log(err);
      }

  };

  const getEventQ = async () => {
    try {
      if (!program) throw new Error("No program found!!");
      // await initializeMarket(program);
      const eventQResponse = await program.account.eventQueue.fetch(
        new anchor.web3.PublicKey(eventQPda)
      );

      setEventQ(
        (eventQResponse?.buf as any[])?.map((item) => {
          const price = priceFromOrderId(item?.orderId)
          return {
            ...item,
            price,
            nativeQtyPaid:item?.nativeQtyPaid.toString(),
            nativeQtyReleased:item?.nativeQtyReleased.toString(),
            orderId:item?.orderId.toString(),
            owner:item?.owner.toString()
          } as const;
        })
      );

      console.log({eventQ})


    } catch (err) {
      console.log(err);
    }
  };

  const getBids = async () => {
    try {
      if (!program) throw new Error("No program found!!");
      // await initializeMarket(program);
      const bidsResponse = await program.account.orders.fetch(
        new anchor.web3.PublicKey(bidsPda)
      );
      setBids(
        bidsResponse?.sorted?.map((item) => {
          return {
            ...item,
            orderId:item.orderId.toString(),
            price: priceFromOrderId(item?.orderId),
            qty: Number(item?.qty.toString()).toFixed(2),
          } as const;
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const getAsks = async () => {
    try {
      if (!program) throw new Error("No program found!!");
      // await initializeMarket(program);
      const asksResponse = await program.account.orders.fetch(
        new anchor.web3.PublicKey(asksPda)
      );
      setAsks(
        asksResponse?.sorted?.map((item) => {
          return {
            ...item,
            orderId:item.orderId.toString(),
            price: priceFromOrderId(item?.orderId),
            qty: Number(item?.qty.toString()).toFixed(2),
          } as const;
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const createNewBid = async (
    limitPrice: anchor.BN,
    maxCoinQty: anchor.BN,
    maxNativePcQty: anchor.BN
  ) => {
    try {
      if (!connectedPublicKey || !signTransaction || !sendTransaction)
        throw Error("No connected wallet found!");
      if (!program) throw new Error("No program found!!");
      const authorityPCTokenAccount = await spl.getAssociatedTokenAddress(
        new anchor.web3.PublicKey(pcMint),
        connectedPublicKey,
        false
      );

      console.log(authorityPCTokenAccount.toString());
      let openOrdersPda;
      let openOrdersPdaBump;
      [openOrdersPda, openOrdersPdaBump] =
        await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from("open-orders", "utf-8"),
            new anchor.web3.PublicKey(marketPda).toBuffer(),
            connectedPublicKey.toBuffer(),
          ],
          program.programId
        );
      // get tx instance from anchor program method
      const orderTx = await program.methods
        .newOrder({ bid: {} }, limitPrice, maxCoinQty, maxNativePcQty, {
          limit: {},
        })
        .accounts({
          openOrders: openOrdersPda,
          market: new anchor.web3.PublicKey(marketPda),
          coinVault: new anchor.web3.PublicKey(coinVault),
          pcVault: new anchor.web3.PublicKey(pcVault),
          coinMint: new anchor.web3.PublicKey(coinMint),
          pcMint: new anchor.web3.PublicKey(pcMint),
          payer: authorityPCTokenAccount,
          bids: new anchor.web3.PublicKey(bidsPda),
          asks: new anchor.web3.PublicKey(asksPda),
          reqQ: new anchor.web3.PublicKey(reqQPda),
          eventQ: new anchor.web3.PublicKey(eventQPda),
          authority: connectedPublicKey.toString(),
        })
        .transaction();
      // signers([connectedPublicKey])
      //.rpc();

      if (!orderTx)
        throw new Error("Something went wrong while building transaction");
      // sign tx
      orderTx.feePayer = connectedPublicKey;
      const latestBlockhash = await connection.getLatestBlockhash();
      console.log(latestBlockhash);
      //toast.success(latestBlockhash);
      orderTx.feePayer = connectedPublicKey;
      orderTx.recentBlockhash = latestBlockhash.blockhash;
      const signedTx = await signTransaction(orderTx);
      toast.success("Signed Tx");
      const signature = await sendTransaction(signedTx, connection);
      toast.success("Tx sent : " + signature);
    } catch (err) {
      console.log(err);
    }
  };

  const createNewAsk = async (
    limitPrice: anchor.BN,
    maxCoinQty: anchor.BN,
    maxNativePcQty: anchor.BN
  ) => {
    try {
      if (!connectedPublicKey || !signTransaction || !sendTransaction)
        throw Error("No connected wallet found!");
      if (!program) throw new Error("No program found!!");
      const authorityPCTokenAccount = await spl.getAssociatedTokenAddress(
        new anchor.web3.PublicKey(pcMint),
        connectedPublicKey,
        false
      );
      console.log(authorityPCTokenAccount.toString());
      let openOrdersPda;
      let openOrdersPdaBump;
      [openOrdersPda, openOrdersPdaBump] =
        await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from("open-orders", "utf-8"),
            new anchor.web3.PublicKey(marketPda).toBuffer(),
            connectedPublicKey.toBuffer(),
          ],
          program.programId
        );
      // get tx instance from anchor program method
      const orderTx = await program.methods
        .newOrder({ ask: {} }, limitPrice, maxCoinQty, maxNativePcQty, {
          limit: {},
        })
        .accounts({
          openOrders: openOrdersPda,
          market: new anchor.web3.PublicKey(marketPda),
          coinVault: new anchor.web3.PublicKey(coinVault),
          pcVault: new anchor.web3.PublicKey(pcVault),
          coinMint: new anchor.web3.PublicKey(coinMint),
          pcMint: new anchor.web3.PublicKey(pcMint),
          payer: authorityPCTokenAccount,
          bids: new anchor.web3.PublicKey(bidsPda),
          asks: new anchor.web3.PublicKey(asksPda),
          reqQ: new anchor.web3.PublicKey(reqQPda),
          eventQ: new anchor.web3.PublicKey(eventQPda),
          authority: connectedPublicKey.toString(),
        })
        .transaction();
      // signers([connectedPublicKey])
      //.rpc();

      if (!orderTx)
        throw new Error("Something went wrong while building transaction");
      // sign tx
      orderTx.feePayer = connectedPublicKey;
      const latestBlockhash = await connection.getLatestBlockhash();
      console.log(latestBlockhash);
      //toast.success(latestBlockhash);
      orderTx.feePayer = connectedPublicKey;
      orderTx.recentBlockhash = latestBlockhash.blockhash;
      const signedTx = await signTransaction(orderTx);
      toast.success("Signed Tx");
      const signature = await sendTransaction(signedTx, connection);
      toast.success("Tx sent : " + signature);
    } catch (err) {
      console.log(err);
    }
  };
  return {openOrders, bids, asks, createNewBid, createNewAsk, eventQ,balances };
};

export default useTestMarket;
