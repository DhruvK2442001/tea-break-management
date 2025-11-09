"use client";

import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function Admin() {
  const [employees, setEmployees] = useState([]);
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    submittedToday: 0,
    pending: 0,
    mostPopular: "-",
    tea: 0,
    coffee: 0,
    milk: 0,
    skipped: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Fetch all users
        const { data: users, error: userError } = await supabase
          .from("users")
          .select("id, name, department, auth_user_id");

        if (userError) throw userError;

        // Fetch today’s preferences
        const today = new Date().toISOString().split("T")[0];
        const { data: prefs, error: prefError } = await supabase
          .from("preferences")
          .select("user_id, beverage, status, created_at")
          .eq("date", today)
          .eq("status", "submitted");

        console.log("prefs", prefs, "users", users);

        if (prefError) throw prefError;

        // Merge data
        const merged = users.map((u) => {
          const pref = prefs.find((p) => p.user_id === u.auth_user_id);
          return {
            name: u.name,
            dept: u.department || "-",
            pref: pref?.beverage ? pref.beverage : "Skip",
            time: pref?.created_at
              ? new Date(pref.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-",
            status: pref?.status || "Pending",
          };
        });

        // Compute summary
        const totalEmployees = users.length;
        const submitted = prefs.filter((p) => p.status === "submitted").length;
        const pending = totalEmployees - submitted;

        const beverageCounts = {
          tea: prefs.filter((p) => p.beverage === "tea").length,
          coffee: prefs.filter((p) => p.beverage === "coffee").length,
          milk: prefs.filter((p) => p.beverage === "milk").length,
          skipped: prefs.filter((p) => p.beverage === "skip").length + pending,
        };

        const mostPopular = Object.entries(beverageCounts)
          .filter(([k]) => k !== "skipped")
          .sort((a, b) => b[1] - a[1])[0]?.[0];

        setEmployees(merged);
        setSummary({
          totalEmployees,
          submittedToday: submitted,
          pending,
          mostPopular: mostPopular
            ? mostPopular.charAt(0).toUpperCase() + mostPopular.slice(1)
            : "-",
          ...beverageCounts,
        });
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // CSV Export
  const handleExport = () => {
    const csvData = [
      ["Name", "Department", "Preference", "Time", "Status"],
      ...employees.map((e) => [e.name, e.dept, e.pref, e.time, e.status]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employee-preferences.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading data...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">☕ Daily Beverage Summary</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard title="Total Employees" value={summary.totalEmployees} />
        <SummaryCard title="Submitted Today" value={summary.submittedToday} />
        <SummaryCard title="Pending" value={summary.pending} />
        <SummaryCard title="Most Popular" value={`☕ ${summary.mostPopular}`} />
      </div>

      {/* Detailed counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-8">
        <DrinkStat label="Tea Orders" count={summary.tea} icon="☕" />
        <DrinkStat label="Coffee Orders" count={summary.coffee} icon="☕" />
        <DrinkStat label="Milk Orders" count={summary.milk} icon="🥛" />
        <DrinkStat label="Skipped" count={summary.skipped} icon="❌" />
      </div>

      {/* Employee table */}
      <div className="bg-white shadow-md rounded-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Employee Preferences</h2>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Download size={18} /> Export Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Department</th>
                <th className="p-2 border">Preference</th>
                <th className="p-2 border">Time</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2 border">{emp.name}</td>
                  <td className="p-2 border">{emp.dept}</td>
                  <td className="p-2 border capitalize">{emp.pref}</td>
                  <td className="p-2 border">{emp.time}</td>
                  <td
                    className={`p-2 border font-medium ${
                      emp.status === "Pending"
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {emp.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Small components for reuse
function SummaryCard({ title, value }) {
  return (
    <div className="bg-white shadow rounded-2xl p-4 text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );
}

function DrinkStat({ label, count, icon }) {
  return (
    <div className="bg-white shadow rounded-2xl p-4 flex flex-col items-center">
      <span className="text-2xl">{icon}</span>
      <p className="text-lg font-semibold">{count}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
