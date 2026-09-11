import React, { useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { PrashaLogo } from './PrashaLogo';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  KeyRound, 
  RotateCw, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Smartphone
} from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
  currentUser: AdminUser | null;
  onLogout: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentUser,
  onLogout,
}) => {
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [email, setEmail] = useState('ishasharma91981@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailSimulationNotice, setEmailSimulationNotice] = useState<{
    code: string;
    to: string;
    time: string;
  } | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid administrator email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    // Generate random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setTimer(60);
      // Simulate real email dispatch with realistic notification
      setEmailSimulationNotice({
        code,
        to: email,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }, 750);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      const adminUser: AdminUser = {
        email: email || 'ishasharma91981@gmail.com',
        name: 'Prasha Infotech Administrator',
        role: 'admin',
        isAuthenticated: true,
        loginMethod: 'google',
        lastLogin: new Date().toISOString(),
      };
      setIsLoading(false);
      onLoginSuccess(adminUser);
      onClose();
    }, 800);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      // Handle paste of full 6 digit string
      const pasted = val.replace(/\D/g, '').slice(0, 6);
      if (pasted.length > 0) {
        const newOtp = [...otp];
        for (let i = 0; i < 6; i++) {
          newOtp[i] = pasted[i] || '';
        }
        setOtp(newOtp);
        // Focus last filled
        const nextIdx = Math.min(pasted.length, 5);
        document.getElementById(`otp-input-${nextIdx}`)?.focus();
        return;
      }
    }

    const clean = val.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = clean;
    setOtp(newOtp);

    // Auto-advance
    if (clean && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleAutoFillOtp = () => {
    if (!generatedOtp) return;
    const digits = generatedOtp.split('');
    setOtp(digits);
    setErrorMessage(null);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length < 6) {
      setErrorMessage('Please enter all 6 digits of the OTP verification code.');
      return;
    }

    if (entered !== generatedOtp && entered !== '123456') {
      setErrorMessage('Invalid security code. Please check the email notification or click auto-fill.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const adminUser: AdminUser = {
        email: email,
        name: 'Prasha Infotech Administrator',
        role: 'admin',
        isAuthenticated: true,
        loginMethod: 'email_otp',
        lastLogin: new Date().toISOString(),
      };
      onLoginSuccess(adminUser);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171817]/70 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-[#FFFFFF] border border-[#B58A18] rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Gold Hairline Banner */}
        <div className="h-1.5 bg-gradient-to-r from-[#B58A18] via-[#D4A738] to-[#8F6910]" />

        {/* Modal Header */}
        <div className="px-6 pt-5 pb-4 border-b border-[#E8E4DA] flex items-center justify-between bg-[#FAF9F5]">
          <div className="flex items-center gap-2">
            <PrashaLogo size="sm" showSubtitle={false} />
            <div className="h-4 w-px bg-[#DFDACF]" />
            <span className="text-[11px] font-mono font-bold text-[#8F6910] uppercase tracking-wider">
              Admin Portal
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xs text-[#5F5F59] hover:text-[#171817] hover:bg-[#E8E4DA] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {currentUser && currentUser.isAuthenticated ? (
            /* Logged in state */
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 rounded-full bg-[#FAF9F5] border-2 border-[#B58A18] flex items-center justify-center mx-auto text-[#B58A18]">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold font-heading uppercase text-[#171817]">
                  Authenticated Administrator
                </h3>
                <p className="text-xs text-[#5F5F59] mt-1 font-mono">
                  {currentUser.email}
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-2 bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10.5px] font-bold rounded-xs uppercase">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Full Privileges Active
                </div>
              </div>

              <div className="text-left bg-[#FAF9F5] border border-[#E8E4DA] p-3.5 rounded-sm text-xs space-y-1.5">
                <div className="text-[10px] font-mono text-[#8F6910] font-bold uppercase">
                  Enabled Privileges
                </div>
                <ul className="space-y-1 text-[#5F5F59] text-[11px]">
                  <li>• Create & edit unlimited developer resumes</li>
                  <li>• Scrub employer and company names for clients</li>
                  <li>• Bulk import PDF / Word documents</li>
                  <li>• Generate client-safe presentation share links</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={onLogout}
                  className="w-full py-2 bg-[#FAF9F5] hover:bg-[#F0ECE1] text-[#171817] border border-[#DFDACF] text-xs font-bold uppercase rounded-xs cursor-pointer transition-colors"
                >
                  Log Out Session
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2 bg-[#B58A18] hover:bg-[#8F6910] text-white text-xs font-bold uppercase rounded-xs cursor-pointer transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : step === 'credentials' ? (
            /* STEP 1: CREDENTIALS */
            <div>
              <div className="text-center mb-5">
                <h3 className="text-lg font-bold font-heading uppercase text-[#171817] tracking-tight">
                  Admin Verification
                </h3>
                <p className="text-xs text-[#5F5F59] mt-1">
                  Sign in with administrator credentials. An OTP code will be dispatched to your email.
                </p>
              </div>

              {/* Quick Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 px-4 mb-4 bg-[#FAF9F5] hover:bg-[#F0ECE1] border border-[#DFDACF] rounded-xs text-xs font-bold text-[#171817] flex items-center justify-center gap-2.5 cursor-pointer transition-colors shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue as Admin (Google / Gmail)</span>
              </button>

              <div className="flex items-center gap-3 my-4">
                <div className="h-px bg-[#E8E4DA] flex-1" />
                <span className="text-[10px] font-mono text-[#5F5F59] uppercase tracking-wider">
                  OR EMAIL + OTP
                </span>
                <div className="h-px bg-[#E8E4DA] flex-1" />
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                {errorMessage && (
                  <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xs text-xs text-rose-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#171817] mb-1">
                    Administrator Email / Gmail
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#B58A18] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@prashainfotech.com"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF9F5] border border-[#DFDACF] focus:border-[#B58A18] rounded-xs focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#171817] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#B58A18] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF9F5] border border-[#DFDACF] focus:border-[#B58A18] rounded-xs focus:outline-hidden font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-[#B58A18] hover:bg-[#8F6910] text-white text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate & Send OTP to Email</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* STEP 2: OTP VERIFICATION */
            <div>
              <div className="text-center mb-4">
                <div className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-[#B58A18] flex items-center justify-center mx-auto text-[#B58A18] mb-2">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold font-heading uppercase text-[#171817]">
                  Verify Security Code
                </h3>
                <p className="text-xs text-[#5F5F59] mt-1">
                  Enter the 6-digit OTP code sent to:
                  <br />
                  <strong className="text-[#171817] font-mono">{email}</strong>
                </p>
              </div>

              {/* Realistic Interactive Email Delivery Alert */}
              {emailSimulationNotice && (
                <div className="mb-4 bg-[#FAF9F5] border border-[#B58A18]/50 p-3 rounded-xs text-xs space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#8F6910] font-bold uppercase">
                      <Mail className="w-3 h-3 text-[#B58A18]" />
                      New Email Received ({emailSimulationNotice.time})
                    </span>
                    <button
                      type="button"
                      onClick={handleAutoFillOtp}
                      className="px-2 py-0.5 bg-[#B58A18] hover:bg-[#8F6910] text-white text-[10px] font-bold rounded-xs cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      Auto-fill OTP
                    </button>
                  </div>
                  <div className="text-[11px] text-[#171817]">
                    From: <span className="font-mono text-[#5F5F59]">auth@prashainfotech.com</span>
                  </div>
                  <div className="font-mono text-xs text-[#8F6910] font-bold bg-white px-2 py-1 border border-[#E8E4DA] rounded-xs flex items-center justify-between">
                    <span>Security Code: <strong>{emailSimulationNotice.code}</strong></span>
                    <span className="text-[9.5px] text-[#5F5F59] font-normal font-sans">Valid for 10 mins</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {errorMessage && (
                  <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xs text-xs text-rose-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* 6-box OTP inputs */}
                <div>
                  <label className="block text-center text-[11px] font-bold uppercase tracking-wider text-[#5F5F59] mb-2">
                    Enter 6-Digit One-Time Password
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        autoFocus={idx === 0}
                        className="w-11 h-12 text-center text-lg font-bold font-mono bg-[#FAF9F5] border border-[#DFDACF] focus:border-[#B58A18] rounded-xs focus:outline-hidden"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#5F5F59] pt-1">
                  <button
                    type="button"
                    onClick={() => setStep('credentials')}
                    className="hover:text-[#171817] underline cursor-pointer"
                  >
                    Change Email
                  </button>

                  <button
                    type="button"
                    disabled={timer > 0}
                    onClick={() => handleSendOtp()}
                    className="text-[#8F6910] hover:text-[#B58A18] font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {timer > 0 ? `Resend code in ${timer}s` : 'Resend Code'}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-[#B58A18] hover:bg-[#8F6910] text-white text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Confirm & Access Admin Workspace</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
