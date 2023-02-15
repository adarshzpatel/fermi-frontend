import React from "react";
import { FiPlus } from "react-icons/fi";
import NextLink from 'next/link'
import Logo from "./Logo";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

type Props = {};

const styles = {
  header:"py-3 px-4 sticky border-b border-gray-700",
  nav:"flex items-center mx-auto justify-between",
  connectWallet:"bg-primary-900/25 text-primary-200 rounded-xl"
}

const Navbar = (props: Props) => {
  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <NextLink href="/">
            <Logo />
          </NextLink>
          <div className="flex gap-4 items-center">

          <NextLink href="/trade" className="hover:bg-gray-800 text-gray-400 font-medium p-2 px-4 ease-out duration-200 rounded-lg">
            Trade
          </NextLink>
          <div className="h-8 w-0.5 bg-gray-600 rounded-md"></div>
            <WalletMultiButton className={styles.connectWallet}/>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;