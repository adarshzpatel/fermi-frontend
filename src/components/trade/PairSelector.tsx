import React, { Dispatch, SetStateAction } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/Select";


type Props = {
  value:string 
  onChange:Dispatch<SetStateAction<string>>
}
const itemList = [
  "SOL/USDT",
  "SOL/USDC",
  "ETH/USDT"
]
const PairSelector = ({value,onChange}: Props) => {
 
  return (
    <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="max-w-[180px] text-xl h-14 pl-4 font-medium">
          <SelectValue placeholder="Trading Pair" />
        </SelectTrigger>
        <SelectContent>
          {itemList?.map((item,idx)=>(
            <SelectItem key={item} value={item}>{item}</SelectItem>
          ))}
        </SelectContent>
      </Select>
  )
}

export default PairSelector