import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { authApi, endpoints } from "../helper/Apis.js";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { echo } from "../helper/echo.js";

ChartJS.register(
  CategoryScale,
  BarElement,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title,
);
export default function StatisticsComponent() {
  const [statistics, setStatistics] = useState([]);
  const statisticsEachDays = useCallback(async () => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(
      endpoints["statistics-each-week"],
    );
    console.log(response.data);
    setStatistics(response.data);
  }, []);
  const [revenueData, setRevenueData] = useState([]);
  const revenuesEachDays = useCallback(async () => {
    const token = Cookies.get("token");
    const response = await authApi(token).get(endpoints["revenue-each-week"]);
    console.log(response.data);
    setRevenueData(response.data);
  }, []);
  useEffect(() => {
    statisticsEachDays();
    revenuesEachDays();
    const token = Cookies.get("token");
    echo(token)
      .join("createOrder")
      .listen(".sendCreateOrder", async () => {
        await statisticsEachDays();
        await revenuesEachDays();
      });

    echo(token)
      .join("changeReturnOrder")
      .listen(".sendChangeReturnOrder", async () => {
        await statisticsEachDays();
        await revenuesEachDays();
      });

    echo(token)
      .join("createSupply")
      .listen(".sendCreateSupply", async () => {
        await statisticsEachDays();
        await revenuesEachDays();
      });
    echo(token)
      .join("changeOrder")
      .listen(".sendChangeOrder", async () => {
        await statisticsEachDays();
        await revenuesEachDays();
      });
  }, []);

  const data = {
    labels: statistics["days"],
    datasets: [
      {
        label: "Orders Per Day",
        data: statistics["ordersPerDay"],
        borderColor: "rgb(255 90 31)",
        backgroundColor: "rgb(255,90,31)",
        tension: 0.4,
      },
      {
        label: "Return Orders Per Day",
        data: statistics["returnOrdersPerDay"],
        borderColor: "rgb(0,0,0)",
        backgroundColor: "rgb(0, 0, 0)",
        tension: 0.4,
      },
    ],
  };
  const data2 = {
    labels: revenueData["days"],
    datasets: [
      {
        label: "Revenue Per Day",
        data: revenueData["revenues"],
        borderColor: "rgb(255 90 31)",
        backgroundColor: "rgb(255,90,31)",
        tension: 0.4,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Orders and Return Orders Per Day",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 50,
        },
      },
      legend: {
        display: true,
        position: "left",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "gray",
        },
        beginAtZero: true,
      },
    },
  };
  const options2 = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Revenues Per Day",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 50,
        },
      },
      legend: {
        display: true,
        position: "left",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "gray",
        },
        beginAtZero: true,
      },
    },
  };
  return (
    <>
      <section className="my-4 bg-white p-4">
        <Line data={data} options={options} />
        <Bar className="mt-8" data={data2} options={options2} />
      </section>
    </>
  );
}
