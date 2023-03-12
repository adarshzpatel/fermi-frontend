import React, { ChangeEvent, FormEvent, useState } from "react";
import Button from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import * as anchor from "@project-serum/anchor";
import useTestMarket from "src/hooks/useTestMarket";
import GradientCard from "@components/ui/GradientCard";
type Props = {};

enum Switch {
  ASK,
  BID,
}

const BuySell = (props: Props) => {
  const [state, setState] = useState<Switch>(Switch.BID);
  const [type, setType] = useState("Limit");
  const [price, setPrice] = useState<number | undefined>();
  const [size, setSize] = useState<number | undefined>();
  const [quantity, setQuantity] = useState<number | undefined>();
  const { createNewBid,createNewAsk } = useTestMarket();

  const createNewOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const limitPrice = new anchor.BN(Number(price));
    const maxCoinQty = new anchor.BN(Number(size));
    const maxNativePcQty = new anchor.BN(Number(quantity)).mul(new anchor.BN(1000000));
    
    if(state === Switch.ASK) {
      await createNewAsk(limitPrice,maxCoinQty,maxNativePcQty)
    } else {
      await createNewBid(limitPrice, maxCoinQty, maxNativePcQty);
    }

  };


  return (
    <GradientCard>
      {/* BUY / SELL */}
      <h6 className=" p-4 font-bold text-center text-xl">SOL-USDC</h6>
      <div className="bg-gray-800 font-bold text-center gap-1 p-1 grid grid-cols-2 ">
        <button
          onClick={() => setState(Switch.BID)}
          className={`${
            state === Switch.BID ? "bg-green-600" : "hover:bg-gray-700"
          } rounded-md py-1`}
        >
          BID
        </button>
        <button
          
          onClick={() => setState(Switch.ASK)}
          className={`${
            state === Switch.ASK ? "bg-red-600" : "hover:bg-gray-700"
          } rounded-md py-1`}
        >
          ASK
        </button>
      </div>
      <form
        onSubmit={createNewOrder}
        className="flex flex-col gap-2 mt-2 p-4"
      >
        <Input
          readOnly
          label="Type"
          labelClassNames="text-sm "
          defaultValue={"Limit"}
          className="cols-span-1"
        />
        <Input
          label="Price"
          labelClassNames="text-sm"
          value={price}
          type="number"
          onChange={(e) => setPrice(Number(e.target.value))}

        />
        <Input
          label="Size (amount of USDC)"
          labelClassNames="text-sm"
          value={size}
          type="number"
          onChange={(e) => setSize(Number(e.target.value))}
        />
        <Input
          label="Quantity(amount of SOL)"
          labelClassNames="text-sm"
          value={quantity}
          type="number"
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        {/* <div className="col-span-2 flex mt-2 items-center justify-center gap-1.5  text-xs rounded-lg bg-gray-700">
          <button type="button" className="hover:bg-gray-800 p-2">10%</button>
          <button className="hover:bg-gray-800 p-2">25%</button>
          <button className="hover:bg-gray-800 p-2">50%</button>
          <button className="hover:bg-gray-800 p-2">75%</button>
          <button className="hover:bg-gray-800 p-2">100%</button>
        </div> */}
        <Button disabled={price === 0 || quantity === 0 || size === 0} variant="primary" className="mt-4 w-full ">
          {state === Switch.ASK ? "ASK" : "BID"}
        </Button>
      </form>
    </GradientCard>
  );
};

export default BuySell;
