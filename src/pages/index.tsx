import { Input } from "@components/ui/Input";
import { AnchorProvider } from "@project-serum/anchor";
import { AnchorWallet, useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";

const PERMISSIONED_MARKET = "EoTcMgcDRTJVZDMZWBoU6rhYHZfkNTVEAfz3uUJRcYGj"
const programId = new PublicKey(PERMISSIONED_MARKET)

export default function Home() {
  

  return (
  <div>
    <Input className="placeholder" placeholder="Hello this is a placeholder"/>
  </div>
  )
}
