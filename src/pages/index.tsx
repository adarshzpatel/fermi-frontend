import Button from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { useGlobalState } from "src/hooks/useGlobalState";

export default function Home() {
  const state = useGlobalState()
  useEffect(()=>{
  },[state])

  return (
    <div>
    </div>
  );
}
