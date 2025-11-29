"use client";
import { useEffect, useState, useCallback } from "react";
import { Download } from "lucide-react";

export default function InstallButton({ className = "" }) {
  const [deferred, setDeferred] = useState(null);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferred(e);
      setAvailable(true);
    };
    const onInstalled = () => {
      setAvailable(false);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleClick = useCallback(async () => {
    if (!deferred) return;
    deferred.prompt();
    try {
      await deferred.userChoice;
    } finally {
      setDeferred(null);
      setAvailable(false);
    }
  }, [deferred]);

  if (!available) return null;

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500 active:scale-[0.98] transition shadow-md ${className}`}
      aria-label="Install app"
    >
      <Download className="mr-2 h-4 w-4" /> Install App
    </button>
  );
}
