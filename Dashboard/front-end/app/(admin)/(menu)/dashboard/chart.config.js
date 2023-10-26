export const pieChartConfig = [
  {
    title: "Properties for Sale",
    value: 684,
    series: [75, 25],
    colors: ["#475BE8", "#E4E8EF"],
  },
  {
    title: "Properties for Rent",
    value: 546,
    series: [60, 40],
    colors: ["#FD8539", "#E4E8EF"],
  },
  {
    title: "Total Customer",
    value: 5732,
    series: [75, 25],
    colors: ["#2ED480", "#E4E8EF"],
  },
  {
    title: "Total City",
    value: 90,
    series: [80, 20],
    colors: ["#FE6D8E", "#E4E8EF"],
  },
];

export const totalChartConfig = {
  series: [
    {
      name: "Col 1",
      data: [44, 55, 57, 56, 61, 58, 63],
    },
    {
      name: "Col 2",
      data: [76, 85, 101, 98, 87, 105, 91],
    },
  ],
  options: {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    colors: ["#475BE8", "#CFC8FF"],
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: "55%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: false,
    },
    stroke: {
      colors: ["transparent"],
      width: 4,
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    },
    yaxis: {
      title: {
        text: "$ (thousands)",
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
    tooltip: {
      y: {
        formatter(val) {
          return `$ ${val} thousands`;
        },
      },
    },
  },
};
