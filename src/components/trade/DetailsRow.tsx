import { useState } from 'react'
import PairSelector from './PairSelector'
import { useGlobalState } from 'src/hooks/useGlobalState'

type Props = {}

type StatItemProps = {
  title:string 
  value:string | number
}
const StatItem = ({title,value}:StatItemProps) => {
  return <div className='p-2 py-1 bg-[#43444D]/25 border-[0.5px] border-[#43444d]  rounded-lg'>
    <p className='text-gray-300 font-medium text-sm'>{title}</p>
    <p className='font-bold text-lg text-gray-100'>{value}</p>
  </div>
}

const DetailsRow = (props: Props) => {
  const [current,setCurrent] = useState<string>("SOL/USDC") 
  const {balances} = useGlobalState()

  return (
    <div className='flex  gap-2 items-center '>
        <div className='flex-1'>
        <PairSelector value={current} onChange={setCurrent}/>
        </div>
        <StatItem title="USDC Balance" value={balances?.nativePcFree}/>
        <StatItem title="SOL Balance" value={balances?.nativeCoinTotal}/>
    </div>
  )
}

export default DetailsRow