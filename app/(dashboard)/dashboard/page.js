"use client";

import TeaMakerDashboard from "@/app/(dashboard)/tea-maker-dashboard/page";
import Cookies from "js-cookie";
import EmployeeDashboard from "../employee-dashboard/page";
import Admin from "../admin/page";

export default function Dashboard() {
  const role = Cookies.get("role");
  console.log("role", role);
  return (
    <div>
      {role === "tea_maker" ? (
        <TeaMakerDashboard />
      ) : role === "employee" ? (
        <EmployeeDashboard />
      ) : (
        <Admin />
      )}
    </div>
  );
}
