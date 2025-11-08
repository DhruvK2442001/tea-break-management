import { NextResponse } from "next/server";

export default function middleware(request) {
  console.log("=== Middleware Debug Start ===");

  console.log("=== Middleware Debug End ===");

  return NextResponse.next();
}
