"use client";
import Header from "@/components/Dashboard/Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="h-full w-full flex flex-col">
      <Header />
      <div className="flex-1">{children}</div>
    </div>
  );
}
