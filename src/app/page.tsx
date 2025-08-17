"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PredictionChart from "./components/PredictionChart";
import ProfitCalculator from "./components/ProfitCalculator";
import VoiceAssistant from "./components/VoiceAssistant";

interface CropPrice {
  crop: string;
  price: number;
}

const cropIcons: Record<string, string> = {
  Tomato: "🍅",
  Onion: "🧅",
  Potato: "🥔",
  Rice: "🌾",
  Wheat: "🌿",
  Chilli: "🌶",
  Maize: "🌽",
  Sugarcane: "🍬"
};

export default function Home() {
  const [prices, setPrices] = useState<CropPrice[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [highlightChart, setHighlightChart] = useState(false);
  const [highlightCalci, setHighlightCalci] = useState(false);

  const themeColors: Record<string, string> = {
    Tomato: "#ff4d4d",
    Wheat: "#ffd633",
    Rice: "#33cc33",
    Maize: "#ffcc33",
    Chilli: "#ff3300",
    Onion: "#cc33ff",
    Potato: "#d4a373",
    Sugarcane: "#00e6e6",
    default: "#7dd3fc"
  };

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch("/api/prices", { cache: "no-store" });
        const data = await res.json();
        if (Array.isArray(data.records) && data.records.length > 0) {
          setPrices(data.records);
          if (!selectedCrop) setSelectedCrop(data.records[0].crop);
        }
      } catch (err) {
        console.error("Error fetching prices:", err);
      }
    }
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const currentPrice = prices.find((p) => p.crop === selectedCrop)?.price || 0;

  const handleCropChange = (crop: string) => {
    setSelectedCrop(crop);
    setHighlightChart(true);
    setHighlightCalci(true);
    setTimeout(() => {
      setHighlightChart(false);
      setHighlightCalci(false);
    }, 800);
  };

  const currentTheme = themeColors[selectedCrop] || themeColors.default;

  return (
    <main
      className="min-h-screen px-6 py-8 font-sans transition-colors duration-700"
      style={{
        background: `linear-gradient(135deg, #0a0f1f, ${currentTheme}20)`
      }}
    >
      {/* Title */}
      <motion.h1
        className="text-6xl font-extrabold text-center mb-12 drop-shadow-lg tracking-wide"
        style={{ color: currentTheme }}
      >
        🌾 Smart Crop Market Dashboard
      </motion.h1>

      {/* Price Ticker */}
      <motion.div
        className="backdrop-blur-xl p-4 rounded-xl shadow-lg border mb-10 overflow-hidden"
        style={{ borderColor: currentTheme }}
      >
        {prices.length > 0 ? (
          <div className="flex space-x-12 animate-marquee whitespace-nowrap">
            {prices.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleCropChange(item.crop)}
                className="flex items-center space-x-2 px-4 py-1 rounded-lg transition cursor-pointer"
                style={{ transition: "0.3s" }}
              >
                <span className="font-bold text-white text-lg">
                  {cropIcons[item.crop] || "🌱"} {item.crop}:
                </span>
                <span
                  className={`${
                    item.price > 3000 ? "text-green-400" : "text-red-400"
                  } font-bold text-lg`}
                >
                  ₹{item.price}/quintal
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300">Loading prices...</p>
        )}
      </motion.div>

      {/* Crop Selector */}
      {prices.length > 0 && (
        <div className="flex justify-center mb-10">
          <select
            value={selectedCrop}
            onChange={(e) => handleCropChange(e.target.value)}
            className="border-2 rounded-lg p-3 shadow-lg font-semibold transition"
            style={{
              backgroundColor: "#0a0f1f",
              color: "white",
              borderColor: currentTheme
            }}
          >
            {prices.map((item, idx) => (
              <option key={idx} value={item.crop} className="text-black">
                {cropIcons[item.crop] || "🌱"} {item.crop}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          animate={
            highlightChart
              ? { scale: 1.02, boxShadow: `0 0 25px ${currentTheme}` }
              : {}
          }
          className="lg:col-span-2 p-6 rounded-2xl shadow-2xl border"
          style={{
            borderColor: currentTheme,
            backgroundColor: "#0a0f1f"
          }}
        >
          {prices.length > 0 && (
            <PredictionChart
              crop={selectedCrop}
              pastPrices={[
                currentPrice - 150,
                currentPrice - 80,
                currentPrice - 20
              ]}
              themeColor={currentTheme}
            />
          )}
        </motion.div>

        <motion.div
          animate={
            highlightCalci
              ? { scale: 1.02, boxShadow: `0 0 25px ${currentTheme}` }
              : {}
          }
          className="p-6 rounded-2xl shadow-lg border"
          style={{
            borderColor: currentTheme,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)"
          }}
        >
          {prices.length > 0 && (
            <ProfitCalculator
              crop={selectedCrop}
              currentPrice={currentPrice}
              themeColor={currentTheme}
            />
          )}
        </motion.div>

        <motion.div
          className="p-6 rounded-2xl shadow-lg border lg:col-span-3"
          style={{
            borderColor: currentTheme,
            backgroundColor: "#0a0f1f"
          }}
        >
          {prices.length > 0 && (
            <VoiceAssistant prices={prices} themeColor={currentTheme} />
          )}
        </motion.div>
      </div>

      {/* Marquee Animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 18s linear infinite;
        }
      `}</style>
    </main>
  );
}
