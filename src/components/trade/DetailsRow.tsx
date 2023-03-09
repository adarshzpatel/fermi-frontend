import { Select } from '@components/ui/Select'
import React, { useState } from 'react'
import PairSelector from './PairSelector'

type Props = {}

type StatItemProps = {
  title:string 
  value:string | number
}
const StatItem = ({title,value}:StatItemProps) => {
  return <div className='p-2 py-1 bg-gray-800 rounded-lg'>
    <p className='text-gray-400 font-medium text-sm'>{title}</p>
    <p className='font-bold text-lg text-gray-100'>{value}</p>
  </div>
}

const DetailsRow = (props: Props) => {
  const [current,setCurrent] = useState<string>("SOL/USDC")
  return (
    <div className='flex gap-2 items-center  '>
        <PairSelector value={current} onChange={setCurrent}/>
        <StatItem title="Oracle Price" value={10.00}/>
        <StatItem title="24hr Change" value={"2.00 %"}/>
        <StatItem title="24hr Volume" value={"$ 0.00"}/>
        <StatItem title="Daily Change" value={"1.00%"}/>
    </div>
  )
}

export default DetailsRow