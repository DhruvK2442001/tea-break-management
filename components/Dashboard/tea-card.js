"use client";

import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";

export default function TeaCard() {
  const [summaryData, setSummaryData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("preferences")
        .select("beverage");

      if (error) {
        console.error("Error fetching beverages:", error);
        return;
      }

      const summary = data.reduce((acc, item) => {
        acc[item.beverage] = (acc[item.beverage] || 0) + 1;
        return acc;
      }, {});

      setSummaryData(summary);
    };

    fetchData();
  }, []);

  const beverages = [
    { name: "Tea", icon: "☕" },
    { name: "Coffee", icon: "☕" },
    { name: "Milk", icon: "🥛" },
  ];

  const total = Object.values(summaryData).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Beverage cards */}
      <div className="flex gap-4 justify-start flex-wrap w-full">
        {beverages.map(({ name, icon }) => (
          <Card key={name} className="w-1/3 text-center">
            <CardHeader>
              <CardTitle className="text-4xl">{icon}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{summaryData[name] || 0}</p>
              <p className="text-gray-600">{name}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Total card */}
      <div className="flex justify-center">
        <Card className="w-1/2 text-center bg-gray-50">
          <CardContent>
            <p className="mt-2 font-semibold text-lg">Total Orders: {total}</p>
            <span>Auto-refreshing every minute</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
