"use client";
import Kitchen from "@/components/Kitchen/kitchen";
import Solution from "@/components/Solution/solution";
import Wardrobe from "@/components/Wardrobe/wardrobe";
import Summary from "@/components/summary";
import { useState } from "react";

export default function Home() {
  const [tab, switchTab] = useState(1); // Setting the default active tab to 1

  return (
    <div className="flex flex-col min-h-screen">
      <h2 className="mt-2 text-center">Custom Calculator</h2>
      <button
        onClick={() => switchTab(4)}
        className={`text-lg rounded-lg mb-2 mx-2 p-4 ${
          tab === 4 ? "bg-blue-400" : "bg-gray-400"
        }`}
      >
        Summary
      </button>
      <div className="flex justify-center my-6 flex-wrap">
        <button
          onClick={() => switchTab(1)}
          className={`text-lg rounded-lg rounded-bl-lg p-4 ${
            tab === 1 ? "bg-blue-400" : "bg-gray-400"
          }`}
        >
          Kitchen
        </button>
        <button
          onClick={() => switchTab(2)}
          className={`text-lg rounded-lg rounded-bl-lg mx-2 p-4 ${
            tab === 2 ? "bg-blue-400" : "bg-gray-400"
          }`}
        >
          Services
        </button>

        <button
          onClick={() => switchTab(3)}
          className={`text-lg rounded-lg rounded-br-lg p-4 ${
            tab === 3 ? "bg-blue-400" : "bg-gray-400"
          }`}
        >
          Wardrobe
        </button>
      </div>
      <div className="flex-1 bg-gray-400">
        {/* Render all components but conditionally show only the active tab */}
        <div className={`${tab !== 1 && "hidden"}`}>
          <Kitchen />
        </div>
        <div className={`${tab !== 2 && "hidden"}`}>
          <Solution />
        </div>
        <div className={`${tab !== 3 && "hidden"}`}>
          <Wardrobe />
        </div>
        <div className={`${tab !== 4 && "hidden"}`}>
          <Summary />
        </div>
      </div>
    </div>
  );
}
