import { createChart, ColorType } from "lightweight-charts";
import React, { useEffect, useRef } from "react";

export const ChartComponent = ({
  data,
}: {
  data: { time: string; value: number }[];
}) => {
  const colors = {
    backgroundColor: "#111216",
    lineColor: "#c084fc",
    textColor: "white",
    areaTopColor: "rgba(139, 92, 246, 0.5)",
    areaBottomColor: "rgba(79,70,229,0.0)",
  };  

  const chartContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chartContainerRef?.current === null) return;
    const handleResize = () => {
      if (chartContainerRef?.current === null) return;
      chart.applyOptions({ width: chartContainerRef?.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: colors.backgroundColor },
        textColor: colors.textColor,
      },
      grid: {
        vertLines: { color: "#27272a" },
        horzLines: { color: "#27272a" },
      },
      width: chartContainerRef.current.clientWidth - 4,
      height: 496,
    });
    chart.timeScale().fitContent();

    const newSeries = chart.addAreaSeries({
      lineColor: colors.lineColor,
      topColor: colors?.areaTopColor,
      lineWidth:2,
      bottomColor: colors?.areaBottomColor,
    });
    newSeries.setData(data)
;

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [
    data,
    colors.backgroundColor,
    colors.lineColor,
    colors.textColor,
    colors.areaTopColor,
    colors.areaBottomColor,
  ]);

  return <div className="m-1" ref={chartContainerRef} />;
};
