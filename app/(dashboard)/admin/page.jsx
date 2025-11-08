"use client";

import React from "react";
import { Download } from "lucide-react";

export default function Admin() {
  const summary = {
    totalEmployees: 35,
    submittedToday: 32,
    pending: 3,
    mostPopular: "Tea",
    tea: 15,
    coffee: 12,
    milk: 5,
    skipped: 3,
  };

  const employees = [
    {
      name: "Rajesh Kumar",
      dept: "IT",
      pref: "Tea",
      time: "09:15 AM",
      status: "Submitted",
    },
    {
      name: "Priya Sharma",
      dept: "HR",
      pref: "Coffee",
      time: "09:20 AM",
      status: "Submitted",
    },
    {
      name: "Amit Patel",
      dept: "Sales",
      pref: "Milk",
      time: "09:18 AM",
      status: "Submitted",
    },
    {
      name: "Sneha Joshi",
      dept: "Marketing",
      pref: "Skip",
      time: "-",
      status: "Pending",
    },
    {
      name: "Vikram Singh",
      dept: "IT",
      pref: "Tea",
      time: "09:12 AM",
      status: "Submitted",
    },
  ];

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
                  <td className="p-2 border">{emp.pref}</td>
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
