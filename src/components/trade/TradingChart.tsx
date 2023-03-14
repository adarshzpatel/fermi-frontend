import GradientCard from "@components/ui/GradientCard";
import React, { useEffect, useMemo, useState } from "react";
import { useGlobalState } from "src/hooks/useGlobalState";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { priceFromOrderId, timestampFromOrderId } from "@utils/program";
import { BN } from "@project-serum/anchor";
import moment from "moment";
import { timeStamp } from "console";
type Props = {};


// todo : show chart from event Q
const TradingChart = (props: Props) => {
	const { eventQ } = useGlobalState();
	
	
	const data = useMemo(()=>{
		if(eventQ.length === 0) return
		let newData:{time:string,price:number}[] = [];
		(eventQ as any[])?.sort((a,b)=> a.timestamp - b.timestamp)
		eventQ.forEach((item:any)=>{
			// get only those events which have maker = "true"
			const isMaker = item["maker"] == "true"
			if(isMaker){
				const time = moment(Number(item?.timestamp)).format("lll")
				const price = Number(priceFromOrderId(new BN(item?.order_id)))
				newData.push({time,price})
			}
		})
		return newData
	},[eventQ])
	
  if(eventQ.length === 0){
		return <div className="col-span-2 w-full h-full bg-[#111216] border-cyan-400/50 border-[1px] rounded-md z-50 flex items-center justify-center">	
				No Events found to display chart!
			</div>
	}
	return (
			<div className="col-span-2 w-full h-full ">
      <ResponsiveContainer width="100%" height="100%" className={"flex-1 bg-[#111216] border-cyan-400/50 border-[1px] rounded-md z-50"}>
				<AreaChart
          width={500}
          height={400}
          data={data || []}
          margin={{
						top: 20,
            right: 20,
            left: 0,
            bottom: 0,
          }}
					>
						<defs>

					<linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
					<stop offset="5%" stopColor="#c084fc" stopOpacity={0.25}/>
					<stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
				</linearGradient>
						</defs>
          <XAxis dataKey="time" />
					<CartesianGrid strokeDasharray="3 3" stroke="#27272a"/>
          <YAxis  />
          <Tooltip wrapperClassName="!bg-[#111216] !border-[#c084fc] rounded-lg" />
          <Area type="linear" dataKey="price" stroke="#c084fc" fill="url(#gradient)" fillOpacity={1}/>
        </AreaChart>
      </ResponsiveContainer>
					</div>
  );
};

export default TradingChart;
