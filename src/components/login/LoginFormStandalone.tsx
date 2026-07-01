import React from "react";
import { useRemoteCSS } from "../../hooks/useRemoteCSS";
import LoginForm from "./LoginForm";

export default function LoginFormStandalone() {
  const { loaded, error } = useRemoteCSS(
    process.env.NEXT_PUBLIC_REMOTE_SHARED_URL || "http://localhost:3342",
    "shared_remote",
    "./store"
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">
          <p className="font-semibold">Gagal memuat halaman</p>
          <p className="text-xs mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4">
        <p className="text-slate-400">Memuat komponen...</p>
      </div>
    );
  }

  return <LoginForm />;
}
