import Button from '@components/ui/Button'
import { Input } from '@components/ui/Input'
import React from 'react'

type Props = {}

const BuySell = (props: Props) => {
  return (
    <div className="border flex flex-col border-gray-700 rounded-lg">
          {/* BUY / SELL */}
          <h6 className=" p-4 font-bold text-center text-xl">SOL-PERP</h6>
          <div className="bg-gray-800 font-bold text-center gap-1 p-1 grid grid-cols-2 ">
            <div className="bg-green-600 rounded-md py-1 ">BUY</div>
            <div className="py-1 hover:bg-gray-700 rounded-md">SELL</div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 p-4">
            <Input label="Type" labelClassNames="text-sm" />
            <Input label="Price" labelClassNames="text-sm" />
            <Input label="Size" labelClassNames="text-sm" />
            <Input label="Quantity" labelClassNames="text-sm" />
            <div className="col-span-2 flex mt-2 items-center justify-center gap-1.5  text-xs rounded-lg bg-gray-700">
              <button className="hover:bg-gray-800 p-2">10%</button>
              <button className="hover:bg-gray-800 p-2">25%</button>
              <button className="hover:bg-gray-800 p-2">50%</button>
              <button className="hover:bg-gray-800 p-2">75%</button>
              <button className="hover:bg-gray-800 p-2">100%</button>
            </div>
          </div>
          <Button variant="primary" className="mx-4 mb-4">
            BUY SOL
          </Button>
        </div>
  )
}

export default BuySell