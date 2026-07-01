import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import dynamic from 'next/dynamic';
import { Lock, RefreshCw, ChevronLeft } from 'lucide-react';

const Button = dynamic(() => import('shared_remote/Button').then(m => m.Button), { ssr: false });

export function OtpForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [tempUser, setTempUser] = useState<any>(null);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(59);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    const tempUserStr = sessionStorage.getItem('neocentra_temp_user');
    if (!tempUserStr) {
      router.push('/login');
      return;
    }
    setTempUser(JSON.parse(tempUserStr));
  }, [router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (!otp[index] && index > 0) {
        // If current value is empty, clear and focus previous input
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Just clear current input
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (pastedData.length !== 6 || isNaN(Number(pastedData))) return;

    const newOtp = pastedData.split('');
    setOtp(newOtp);
    inputRefs.current[5]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Harap masukkan 6 digit kode OTP');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: tempUser.username,
          role: tempUser.role,
          email: tempUser.email,
          otpCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Verifikasi OTP gagal');
      }

      const data = await response.json();
      const { loginSuccess } = await import('shared_remote/store');
      dispatch(loginSuccess({ user: data.user, token: null }));
      sessionStorage.removeItem('neocentra_temp_user');
      router.push('/');
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.message || 'Kode OTP salah (Gunakan kode mock: 123456)');
      // Clear OTP inputs
      setOtp(new Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setCountdown(59);
    setError('');
    setOtp(new Array(6).fill(''));
    inputRefs.current[0]?.focus();
  };

  if (!tempUser) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4 font-sans relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-teal-500/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px]" />

      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl relative z-10 transition-all duration-300">
        <button
          onClick={() => router.push('/login')}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-6 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Kembali ke Login</span>
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-teal-500/20 mb-4 text-white">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Verifikasi Dua Langkah</h2>
          <p className="text-xs text-slate-400 mt-2 text-center px-4">
            Masukkan kode verifikasi OTP yang dikirimkan ke email terdaftar Anda: <strong className="text-teal-400">{tempUser.email}</strong>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg p-3 text-center">
              {error}
            </div>
          )}

          <div className="flex justify-between gap-2.5">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el;
                }}
                className="w-12 h-14 text-center text-xl font-extrabold bg-slate-950 border border-slate-800 rounded-xl focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-teal-400"
              />
            ))}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Memverifikasi OTP...' : 'Verifikasi & Masuk'}
          </Button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-2.5 text-xs">
          {countdown > 0 ? (
            <span className="text-slate-400">
              Kirim ulang OTP dalam <strong className="text-slate-200">{countdown}s</strong>
            </span>
          ) : (
            <button
              onClick={handleResend}
              className="flex items-center gap-1.5 text-teal-400 hover:text-teal-300 font-bold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Kirim Ulang Kode OTP</span>
            </button>
          )}
          <span className="text-[10px] text-slate-500">Gunakan kode demo: 123456</span>
        </div>
      </div>
    </div>
  );
}

export default OtpForm;
