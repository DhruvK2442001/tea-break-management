"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, Milk, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function EmployeeDashboard() {
  const [timeLeft, setTimeLeft] = useState("15:42");
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState(null);

  const history = [
    { day: "Thu 06 Nov", choice: "Tea" },
    { day: "Wed 05 Nov", choice: "Coffee" },
    { day: "Tue 04 Nov", choice: "Tea" },
    { day: "Mon 03 Nov", choice: "Milk" },
  ];

  const handleSubmit = async (choice) => {
    try {
      setSelected(choice);
      setSubmitted(true);

      // ✅ Get the currently logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("No logged-in user found:", userError?.message);
        setSubmitted(false);
        return;
      }

      const userId = user.id; // 🔑 use this instead of undefined variable

      // ✅ Insert into preferences table
      const { data: insertData, error } = await supabase
        .from("preferences")
        .insert([
          {
            beverage: choice === "skip" ? null : choice.toLowerCase(),
            user_id: userId, // match your column name exactly
            status: "submitted",
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) {
        console.error("Error saving preference:", error.message);
        setSubmitted(false);
        return;
      }

      console.log("✅ Preference saved:", insertData);
    } catch (err) {
      console.error("Unexpected error:", err);
      setSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow">
        <div>
          <h1 className="text-2xl font-bold">Morning Break ☀️</h1>
          <p className="text-gray-500">Submission Deadline: 10:30 AM</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Time Remaining</p>
          <p className="text-xl font-semibold text-green-600">{timeLeft}</p>
        </div>
      </div>

      {/* Beverage Selection */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-xl">What would you like today?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-6 flex-wrap">
            {/* Tea */}
            <Button
              variant={selected === "Tea" ? "default" : "outline"}
              onClick={() => handleSubmit("Tea")}
              className="w-32 h-32 flex flex-col items-center justify-center gap-2 text-lg"
              disabled={submitted}
            >
              <span className="text-3xl">☕</span>
              Tea
            </Button>

            {/* Coffee */}
            <Button
              variant={selected === "Coffee" ? "default" : "outline"}
              onClick={() => handleSubmit("Coffee")}
              className="w-32 h-32 flex flex-col items-center justify-center gap-2 text-lg"
              disabled={submitted}
            >
              <Coffee className="w-8 h-8" />
              Coffee
            </Button>

            {/* Milk */}
            <Button
              variant={selected === "Milk" ? "default" : "outline"}
              onClick={() => handleSubmit("Milk")}
              className="w-32 h-32 flex flex-col items-center justify-center gap-2 text-lg"
              disabled={submitted}
            >
              <Milk className="w-8 h-8" />
              Milk
            </Button>

            {/* Skip */}
            <Button
              variant={selected === "Skip" ? "destructive" : "outline"}
              onClick={() => handleSubmit("Skip")}
              className="w-32 h-32 flex flex-col items-center justify-center gap-2 text-lg"
              disabled={submitted}
            >
              <XCircle className="w-8 h-8" />
              Skip
            </Button>
          </div>

          {/* Submission Message */}
          {submitted && (
            <div className="mt-6 text-center text-green-600 font-semibold">
              ✓ Preference Submitted — You chose {selected}
            </div>
          )}
        </CardContent>
      </Card>

      {/* History */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Your Preference History</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {history.map((item, i) => (
              <li
                key={i}
                className="flex justify-between border-b pb-1 text-gray-700"
              >
                <span>{item.day}</span>
                <span className="font-medium">{item.choice}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
