"use client";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "../ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Header() {
  const role = Cookies.get("role");
  const { clearCredentials } = useAuthStore();
  const router = useRouter();
  const handleLogout = () => {
    const { data, error } = supabase.auth.signOut();
    console.log("Logout data:", data);
    console.log("Logout error:", error);
    if (error) {
      console.error("Logout failed:", error.message);
      return;
    }
    clearCredentials();
    router.push("/login");
  };
  return (
    <div className="w-full h-20 p-2 flex bg-accent">
      <div className="flex justify-start items-start flex-col w-full p-2">
        <span>{role} Dashboard</span>
        <span className="text-gray-400">Morning Break Management</span>
      </div>
      <div className="flex w-full justify-end items-center">
        <Button className={"flex"} variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
