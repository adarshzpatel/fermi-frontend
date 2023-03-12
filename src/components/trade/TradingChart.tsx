import GradientCard from '@components/ui/GradientCard'
import React from 'react'
import { ChartComponent } from './ChartComponent';
import useTestMarket from 'src/hooks/useTestMarket';

type Props = {}

const initialData = [
	{ time: '2018-12-22', value: 32.51 },
	{ time: '2018-12-23', value: 31.11 },
	{ time: '2018-12-24', value: 27.02 },
	{ time: '2018-12-25', value: 27.32 },
	{ time: '2018-12-26', value: 25.17 },
	{ time: '2018-12-27', value: 28.89 },
	{ time: '2018-12-28', value: 25.46 },
	{ time: '2018-12-29', value: 23.92 },
	{ time: '2018-12-30', value: 22.68 },
	{ time: '2018-12-31', value: 22.67 },
];

// todo : show chart from event Q
const TradingChart = (props: Props) => {
  const {eventQ} = useTestMarket()
	console.log({eventQ})
  return (
  <GradientCard cls={"col-span-2 items-center justify-center "}>
      <ChartComponent data={eventQ.map((item,id)=>({time:`2023-03-${id < 10 ? "0":""}${id+1}`,value:Number(item?.price)}))}/>
  </GradientCard>
  )
}

export default TradingChart