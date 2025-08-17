"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ChartOptions
} from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

interface PredictionChartProps {
  crop: string;
  pastPrices: number[];
  themeColor: string;
}

export default function PredictionChart({ crop, pastPrices, themeColor }: PredictionChartProps) {
  const lastPrice = pastPrices[pastPrices.length - 1] || 0;
  const predictedPrices = Array.from({ length: 5 }, (_, i) =>
    Math.round(lastPrice + (Math.sin(i) * 100 - 50))
  );

  const labels = [
    "Day -3",
    "Day -2",
    "Day -1",
    "Today",
    "Day +1",
    "Day +2",
    "Day +3",
    "Day +4",
    "Day +5"
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Past & Present Prices",
        data: [...pastPrices, lastPrice],
        borderColor: themeColor,
        backgroundColor: themeColor + "40",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: themeColor,
        pointBorderColor: "#fff",
        borderWidth: 3
      },
      {
        label: "Predicted Future Prices",
        data: Array(pastPrices.length).fill(null).concat(predictedPrices),
        borderColor: "#f87171",
        backgroundColor: "#f8717140",
        borderDash: [6, 6],
        tension: 0.4,
        pointBackgroundColor: "#f87171",
        pointBorderColor: "#fff",
        borderWidth: 3
      }
    ]
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#fff", font: { weight: "bold" } }
      }
    },
    scales: {
      x: {
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.1)" }
      },
      y: {
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.1)" }
      }
    },
    animation: {
      duration: 1500,
      easing: "easeOutQuart"
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2
        className="text-xl font-bold mb-4 flex items-center gap-2"
        style={{ color: themeColor }}
      >
        📈 Price Prediction for {crop}
      </h2>
      <div style={{ height: "420px" }}>
        <Line data={data} options={options} />
      </div>
    </motion.div>
  );
}
