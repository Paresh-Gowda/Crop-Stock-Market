"use client";
import { useState, useRef } from "react";

interface VoiceAssistantProps {
  prices: { crop: string; price: number }[];
  themeColor: string;
}

export default function VoiceAssistant({ prices, themeColor }: VoiceAssistantProps) {
  const [response, setResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setResponse("Your browser does not support voice recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript.trim();
      handleQuery(spokenText);
    };

    recognition.onerror = () => {
      setResponse("Sorry, I couldn't hear you clearly. Please try again.");
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleQuery = (query: string) => {
    const found = prices.find(
      (p) => p.crop.toLowerCase() === query.toLowerCase()
    );

    let answer = "";
    if (found) {
      answer = `The current price of ${found.crop} is ₹${found.price} per quintal.`;
    } else {
      answer = `I don't have data for "${query}". Try asking about crops like ${prices
        .slice(0, 5)
        .map((p) => p.crop)
        .join(", ")}.`;
    }

    setResponse(answer);

    // Speak the answer
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(answer);
    utterance.lang = "en-IN";
    synth.speak(utterance);
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
        🎤 Voice AI Assistant
      </h2>
      <p className="mb-4 text-white">
        Click the microphone and ask me the current price of any crop.
      </p>

      {/* Microphone Button */}
      <button
        onClick={startListening}
        className="relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          backgroundColor: isListening ? themeColor : `${themeColor}CC`,
          boxShadow: isListening ? `0 0 30px ${themeColor}` : `0 0 10px ${themeColor}`,
        }}
      >
        🎙
        {isListening && (
          <>
            <span
              className="absolute w-24 h-24 rounded-full border-2 animate-ping"
              style={{ borderColor: themeColor }}
            ></span>
            <span
              className="absolute w-28 h-28 rounded-full border-2 animate-ping delay-150"
              style={{ borderColor: themeColor }}
            ></span>
          </>
        )}
      </button>

      {/* Response Box */}
      {response && (
        <p
          className="mt-6 p-3 rounded text-black font-semibold"
          style={{
            background: "white",
            border: `2px solid ${themeColor}`,
          }}
        >
          {response}
        </p>
      )}
    </div>
  );
}
