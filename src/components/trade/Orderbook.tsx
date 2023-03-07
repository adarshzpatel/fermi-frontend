import { FiTrendingUp } from "react-icons/fi";
import useTestMarket from "src/hooks/useTestMarket";

type Props = {};

type OrderRowProps = {
  price: string;
  qty: string;
};

const AskRow = ({ price, qty }: OrderRowProps) => {
  return (
    <div className="flex justify-between items-center font-medium">
      <span className="text-red-500">{qty}</span>
      <span>{price}</span>
    </div>
  );
};

const BidRow = ({ price, qty }: OrderRowProps) => {
  return (
    <div className="flex justify-between items-center font-medium">
      <span>{price}</span>
      <span className="text-green-500">{qty}</span>
    </div>
  );
};

const SkeletonRow = () => {
  return (
    <div className="h-4 bg-gray-100/10 mb-1 rounded-sm animate-pulse w-full"></div>
  );
};

const Orderbook = (props: Props) => {
  const { bids, asks } = useTestMarket();

  return (
    <div className="p-4 cols-span-3 border border-gray-700 rounded-lg">
      <div className="pb-4 font-bold text-center text-xl flex justify-between">
        Orderbook
        <div className="text-green-500 flex items-center justify-center gap-2  ">
          <FiTrendingUp className="h-6 w-6" />
          30.46
        </div>
      </div>
      <div className="flex items-center font-bold justify-between text-sm mt-2 text-gray-500">
        <div>Price(SOL)</div>
        <div>Quantity</div>
        <div>Price(SOL)</div>
      </div>
      <div className="grid gap-4 grid-cols-2 mt-1">
        {/* Bids Column */}
        <div>
          <div className="bg-green-900/10">
            {bids?.map((item, idx) => (
              <BidRow price={item?.price} qty={item?.qty} key={`bid-${idx}`} />
            ))}
            {bids.length === 0 && (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            )}
          </div>
          {/* Asks column */}
        </div>
        <div>
          <div className="bg-red-900/10">
            {asks?.map((item, idx) => (
              <AskRow price={item?.price} qty={item?.qty} key={`ask-${idx}`} />
            ))}
            {asks.length === 0 && (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orderbook;
