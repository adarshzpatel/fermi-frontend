import { OpenOrderItem as OpenOrderType, OrderItem } from "@components/contexts/types";
import GradientCard from "@components/ui/GradientCard";
import React, { useEffect, useState } from "react";
import { useGlobalState } from "src/hooks/useGlobalState";
import OpenOrdersItem from "./OpenOrderItem";

type Props = {};

const OpenOrders = (props: Props) => {
  const { openOrders, eventQ } = useGlobalState();

  return (
    <GradientCard cls="col-span-3">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-200 ">
          <thead className="text-xs text-gray-200 uppercase bg-gray-900 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Open Orders
              </th>
              <th scope="col" className="px-6 py-3">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {openOrders
              ?.filter((item) => item.price !== "0.00")
              ?.map((item, idx) => (
                <OpenOrdersItem
                  data={item}
                  key={`order-${item?.orderId}`}
                />
              ))}
          </tbody>
        </table>
      </div>
    </GradientCard>
  );
};

export default OpenOrders