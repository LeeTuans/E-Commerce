"use client";

import React from "react";
import dynamic from "next/dynamic";
import { BsArrowUpCircle, BsArrowDownCircle } from "react-icons/bs";

import {
  totalChartConfig as totalChart,
  pieChartConfig as pieChart,
} from "./chart.config";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

function Page() {
  return (
    <>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 w-full">
        {pieChart &&
          pieChart.map((item, i) => {
            return (
              <div
                key={i}
                className="white-box rounded-2xl md:mb-0 py-4 px-4 flex items-center justify-between"
              >
                <div className="pl-0 sm:pl-4">
                  <p className="text-gray-400 text-sm">{item.title}</p>
                  <p className="text-2xl mt-2">{item.value}</p>
                </div>
                <Chart
                  options={{
                    chart: {
                      type: "donut",
                    },
                    grid: {
                      padding: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                      },
                    },
                    colors: item.colors,
                    legend: {
                      show: false,
                    },
                    dataLabels: {
                      enabled: false,
                    },
                  }}
                  series={item.series}
                  type="donut"
                  width={120}
                />
              </div>
            );
          })}
      </div>

      {/* ---------------------------------------------------- */}
      <div className="white-box rounded-2xl mt-5 p-10">
        <p className="text-xl font-medium">Total Revenue</p>
        <div className="flex gap-2 items-center my-6">
          <p className="text-3xl font-medium mr-4">$200</p>
          <BsArrowUpCircle className="text-[#475be8] text-lg" />
          <div className="text-xs text-gray-400">
            <p>0.8%</p>
            <p>Than last month</p>
          </div>
        </div>

        {totalChart.options && totalChart.series && (
          <Chart
            options={totalChart.options}
            series={totalChart.series}
            type="bar"
            height={310}
          />
        )}
      </div>
    </>
  );
}

export default Page;
