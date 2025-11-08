"use client";
import { Input } from "@/components/ui/input";
import { Coffee, Milk } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Login() {
  const {
    clearCredentials,
    setUserName,
    setPassword,
    userName,
    password,
    setRole,
  } = useAuthStore();
  const router = useRouter();
  const handleUserName = (e) => {
    setUserName(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: "dhruv@hotel.com",
        password: "Admin@123",
      });

    if (authError) {
      console.error("Login failed:", authError.message);
      return;
    }

    // Get the logged in user
    const user = authData.user;

    // Fetch role from users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("auth_user_id", user.id)
      .single();

    if (userError) {
      console.error("Failed to fetch role:", userError.message);
      return;
    }

    console.log("Logged in as:", user.email, "Role:", userData.role);
    setRole(userData.role);
    setUserName(user.email);
    setPassword(user.password);
    Cookies.set("role", userData.role);
    Cookies.set("username", user.email);
    Cookies.set("password", user.password);

    router.push("/dashboard");
  };

  useEffect(() => {
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log(
      "Supabase Key:",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Loaded" : "Missing"
    );
  }, []);

  return (
    <div className="flex items-center justify-center h-screen min-h-screen">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md">
        <div className="p-6 flex flex-col gap-4 items-center w-full">
          <span>
            <Coffee />
          </span>
          <span className="text-2xl font-bold"> Morning Break</span>
          <span className="text-sm text-gray-500">
            Tea & Coffee Management System
          </span>
          <Label className="text-sm justify-self-start w-full">Username</Label>
          <Input
            placeholder="Username"
            value={userName}
            onChange={handleUserName}
          />
          <Label className="text-sm justify-self-start w-full">Password</Label>
          <Input
            placeholder="Password"
            value={password}
            onChange={handlePassword}
          />
          <Button className="w-full" variant="default" onClick={handleLogin}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
