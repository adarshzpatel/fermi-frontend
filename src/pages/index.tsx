import Button from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import useMarket from "src/hooks/useMarkets";
import { useProgram } from "src/hooks/useProgram";
import { setupPDAs } from "src/utils/program";

export default function Home() {
  const {connection } = useConnection()
  const wallet = useAnchorWallet()
  return (
    <div>
      <Button onClick={()=> {
        console.log({connection})
        if(!connection || !wallet) throw new Error("No wallet found")
        setupPDAs(connection,wallet)
      }
    }>
        Click me
      </Button>
    </div>
  );
}
