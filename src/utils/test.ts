import { Program } from "@project-serum/anchor";
import { SimpleSerum } from "src/idl/simple_serum";
import * as anchor from "@project-serum/anchor"
import { toast } from "react-hot-toast";
// Test Accounts


export const initializeMarket = async (program:Program<SimpleSerum>) => {
  try{

    const initTx = await program?.methods
    ?.initializeMarket(
      new anchor.BN("1000000000"),
      new anchor.BN("1000000")
      )
      .accounts({
        market: marketPda,
        coinVault:coinVault,
        pcVault:pcVault,
        coinMint: coinMint,
        pcMint: pcMint,
        bids: bidsPda,
        asks: asksPda,
        reqQ: reqQPda,
        eventQ: eventQPda,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();
      
      console.log(initTx);
      toast.success("Market initialized !")
      return true
    } catch(err){
      console.log(err)
      toast.error("Could not initialize market")
      return false
    }
}

