import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { createContext, useMemo } from "react";
import { getProgram, getProvider } from "@utils/program";
import { SimpleSerum } from "src/idl/simple_serum";
import { Program } from "@project-serum/anchor";

type GlobalContextType = {
  program: Program<SimpleSerum> | null
};

export const GlobalContext = createContext<GlobalContextType>({
  program:null
});

type Props = {
  children: React.ReactNode;
};

// TODO :
// - Get program

export const GlobalStateProvider = ({ children }: Props) => {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();

  const program = useMemo(() => {
    if (connection && anchorWallet) {
      const provider = getProvider(connection, anchorWallet);
      const program = getProgram(provider);
      return program;
    } else {
      return null;
    }
  }, [connection,anchorWallet]);

  return <GlobalContext.Provider value={{program}}>{children}</GlobalContext.Provider>;
};
