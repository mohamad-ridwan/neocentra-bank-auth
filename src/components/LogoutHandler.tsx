import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

export function LogoutHandler() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const performLogout = async () => {
      localStorage.removeItem("neocentra_token");
      try {
        const { logout } = await import("shared_remote/store");
        router.push("/login");
        dispatch(logout());
      } catch (err) {
        console.error("Gagal memanggil logout dispatch:", err);
      }
    };
    performLogout();
  }, [dispatch, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-sans">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
        <span className="text-sm font-medium tracking-wide">
          Menghapus Sesi Anda...
        </span>
      </div>
    </div>
  );
}

export default LogoutHandler;
