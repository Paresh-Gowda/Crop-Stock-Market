"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface ProfitCalculatorProps {
  crop: string;
  currentPrice: number;
  themeColor: string;
}

export default function ProfitCalculator({ crop, currentPrice, themeColor }: ProfitCalculatorProps) {
  const [quantity, setQuantity] = useState<number>(0);
  const [costPrice, setCostPrice] = useState<number>(0);
  const [profit, setProfit] = useState<number | null>(null);

  const calculateProfit = () => {
    const revenue = quantity * currentPrice;
    const cost = quantity * costPrice;
    setProfit(revenue - cost);
  };

  return (
    <div
      className="p-6 rounded-2xl shadow-lg border backdrop-blur-md"
      style={{
        borderColor: themeColor,
        background: "rgba(255, 255, 255, 0.05)",
      }}
    >
      <h2
        className="text-2xl font-bold mb-4 flex items-center gap-2"
        style={{ color: themeColor }}
      >
        💰 Profit Calculator
      </h2>

      {/* Quantity Input */}
      <label className="block mb-2 text-white font-semibold">
        Quantity (quintals)
      </label>
      <input
        type="number"
        value={quantity || ""}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="w-full p-2 rounded-lg mb-4 outline-none"
        style={{
          color: "black",
          backgroundColor: "white",
          border: `2px solid ${themeColor}`,
        }}
      />

      {/* Cost Price Input */}
      <label className="block mb-2 text-white font-semibold">
        Cost Price per Quintal (₹)
      </label>
      <input
        type="number"
        value={costPrice || ""}
        onChange={(e) => setCostPrice(Number(e.target.value))}
        className="w-full p-2 rounded-lg mb-4 outline-none"
        style={{
          color: "black",
          backgroundColor: "white",
          border: `2px solid ${themeColor}`,
        }}
      />

      {/* Calculate Button */}
      <motion.button
        onClick={calculateProfit}
        whileHover={{ scale: 1.05, boxShadow: `0 0 15px ${themeColor}` }}
        className="w-full p-3 rounded-lg font-bold transition-all"
        style={{
          background: themeColor,
          color: "black",
        }}
      >
        Calculate
      </motion.button>

      {/* Profit Display */}
      {profit !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1,
            boxShadow:
              profit >= 0
                ? "0 0 20px rgba(34,197,94,0.8)"
                : "0 0 20px rgba(239,68,68,0.8)",
          }}
          transition={{ duration: 0.5 }}
          className="mt-6 p-4 rounded-lg font-bold text-center"
          style={{
            backgroundColor: profit >= 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            color: profit >= 0 ? "#22c55e" : "#ef4444",
          }}
        >
          {profit >= 0
            ? `Profit: ₹${profit.toLocaleString()}`
            : `Loss: ₹${Math.abs(profit).toLocaleString()}`}
        </motion.div>
      )}
    </div>
  );
}
