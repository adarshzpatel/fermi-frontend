import React, { useEffect, useState } from "react";
import * as anchor from "@project-serum/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { SimpleSerum } from "src/idl/simple_serum";
import { getProgram, getProvider, priceFromOrderId } from "@utils/program";
import { asksPda, bidsPda } from "@utils/constants";
import { PublicKey } from "@solana/web3.js";

type ParsedOrder = {
  price: string;
  qty: string;
  orderId: anchor.BN;
  owner: PublicKey;
  ownerSlot: number;
};

const useTestMarket = () => {
  
  const [program, setProgram] = useState<anchor.Program<SimpleSerum> | null>(
    null
  );

  const [asks, setAsks] = useState<ParsedOrder[]>([]);
  const [bids, setBids] = useState<ParsedOrder[]>([]);
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();

  useEffect(() => {
    if (connection && anchorWallet) {
      setProgram(getProgram(getProvider(connection, anchorWallet)));
    } else {
      setProgram(null);
    }
  }, [connection, anchorWallet]);

  useEffect(() => {
    if (program) getBids();
  }, [program]);

  useEffect(() => {
    if (program) getAsks();
  }, [program]);

  const getBids = async () => {
    try {
      if (!program) throw new Error("No program found!!");
      // await initializeMarket(program);
      const bidsResponse = await program.account.orders.fetch(bidsPda);
      setBids(
        bidsResponse?.sorted?.map((item) => {
          return {
            ...item,
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
      const asksResponse = await program.account.orders.fetch(asksPda);
      setAsks(
        asksResponse?.sorted?.map((item) => {
          return {
            ...item,
            price: priceFromOrderId(item?.orderId),
            qty: Number(item?.qty.toString()).toFixed(2),
          } as const;
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  return {bids,asks};
};

export default useTestMarket;
