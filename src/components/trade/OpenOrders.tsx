import GradientCard from "@components/ui/GradientCard";
import { useGlobalState } from "src/hooks/useGlobalState";
import OpenOrdersItem from "./OpenOrderItem";

type Props = {};

const OpenOrders = (props: Props) => {
  const { openOrders, eventQ } = useGlobalState();

  return (
    <GradientCard cls="col-span-3">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-200 ">
          <thead className="text-xs border-b border-b-cyan-900 text-gray-200 uppercase bg-gray-900 ">
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
                <span className="sr-only">Cancel</span>
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Finalize</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {openOrders?.map((item, idx) => (
                <OpenOrdersItem
                  id={item}
                  key={`open_order-${item}`}
                />
              ))}
          </tbody>
        </table>
      </div>
    </GradientCard>
  );
};

export default OpenOrders