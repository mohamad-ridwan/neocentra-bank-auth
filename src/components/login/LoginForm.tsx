import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { Shield } from "lucide-react";

const Button = dynamic(
  () => import("shared_remote/Button").then((m) => m.Button),
  { ssr: false },
);
const Input = dynamic(
  () => import("shared_remote/Input").then((m) => m.Input),
  { ssr: false },
);

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (router.query.timeout === "true") {
      setInfoMessage(
        "Sesi Anda telah berakhir karena tidak ada aktivitas. Silakan masuk kembali.",
      );
    }
  }, [router.query.timeout]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");
    setLoading(true);

    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        const tempUser = {
          username: "admin",
          role: "Super Administrator",
          email: "admin@neocentra.com",
        };
        sessionStorage.setItem("neocentra_temp_user", JSON.stringify(tempUser));
        router.push("/otp");
      } else {
        setError("Invalid username or password (use admin / admin123)");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4 font-sans relative overflow-hidden">
      {/* Background gradients for premium glassmorphic effect */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-teal-500/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px]" />

      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl relative z-10 transition-all duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-teal-500/20 mb-4">
            <span className="text-white font-black text-xl tracking-tighter">
              N
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            NeoCentra Bank
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Portal Autentikasi Pengguna
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {infoMessage && (
            <div className="bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs rounded-lg p-3 text-center">
              {infoMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg p-3 text-center">
              {error}
            </div>
          )}

          <Input
            label="Username"
            value={username}
            onChange={(e: any) => setUsername(e.target.value)}
            placeholder="Masukkan username"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            placeholder="Masukkan password"
            required
          />

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Memverifikasi Kredensial..." : "Lanjutkan"}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
          <Shield className="w-3.5 h-3.5 text-teal-500" />
          <span>Sistem Keamanan Berlapis • Akses Terpantau v1.2</span>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
