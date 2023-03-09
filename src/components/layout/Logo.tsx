import React from "react";
import Image from 'next/image'
;
import Link from "next/link";
type Props = {};

const Logo = (props: Props) => {
  return (
      <Link href={"/"} className="flex  items-center cursor-pointer group gap-3 group">
        {/* <TiFlash className="h-8 w-8 text-primary-500 group-hover:text-primary-400 group-hover:animate-pulse" />÷ */}
        <div className="relative h-10 w-10 rounded-lg overflow-hidden">
        <Image src='/logo.jpeg' fill alt='fermi-protocol-logo'/>
        </div>
        <h1 className="text-3xl font-bold italic text-gray-50">Fermi</h1>
      </Link>
  );
};

export default Logo;