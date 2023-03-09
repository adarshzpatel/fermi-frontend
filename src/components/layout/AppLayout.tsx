import clsx from "clsx";
import React from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";

type Props = {
  showNav?: boolean;
  children: React.ReactNode;
};

const AppContainer = ({ showNav=true, children }: Props) => {
  return (
    <div className="min-h-screen backdrop-blur-xl bg-[#0F1014] backdrop-brightness-50 text-gray-50">
      {showNav && <Navbar />}
      <div
        
        className={clsx(
          "mx-auto p-4 md:p-6 "
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default AppContainer;