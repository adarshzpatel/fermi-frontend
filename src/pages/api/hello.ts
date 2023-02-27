// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Account, Connection, PublicKey } from "@solana/web3.js";
import { Market } from "@project-serum/serum";

type Data = {
  name: string;
};

const MARKET_ADDRESS = "5F7LGsP1LPtaRV7vVKgxwNYX4Vf22xvuzyXjyar7jJqp"
const PROGRAM_ID = "EoTcMgcDRTJVZDMZWBoU6rhYHZfkNTVEAfz3uUJRcYGj"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try{

    let connection = new Connection("https://api.devnet.solana.com");
    // let programAddress = new PublicKey("...")
    let marketAddress = new PublicKey(MARKET_ADDRESS);
    let programAddress = new PublicKey(PROGRAM_ID);
    let market = await Market.load(connection, marketAddress,{},programAddress);
    
    
    let bids = await market.loadBids(connection);
    let asks = await market.loadAsks(connection);
    // L2 orderbook data
    for (let [price, size] of bids.getL2(20)) {
      console.log(price, size);
    }
    // Full orderbook data
    for (let order of asks) {
      console.log(
        order.orderId,
        order.price,
        order.size,
        order.side, // 'buy' or 'sell'
        );
      }
      res.status(200).json({ name: "John Doe" });
    } catch(err) {
      console.log(err)
      res.status(400).json({name:"ERror"})
    }
  }
    