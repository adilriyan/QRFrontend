import { useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from "react-icons/fa";
import { API } from "../api/api"; 
import { useNavigate } from "react-router-dom";

export default function Login() {

  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await API.post("/auth/login", { email, password });
      const token = res.data.token;
      localStorage.setItem("token", token);
      navigate("/");
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.error || "Login failed!";
      setErrorMsg(msg);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
 
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>


      <div className="relative z-10 w-full max-w-md">

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl shadow-slate-950/50 p-8 md:p-10">
          
 
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-teal-500 to-emerald-500 rounded-2xl shadow-lg shadow-teal-500/40 mb-4">
              <FaLock className="w-8 h-8 text-slate-950" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-slate-100 via-teal-100 to-emerald-100 bg-clip-text text-transparent">
              QR Market
            </h1>
            <p className="text-slate-400 mt-2 text-sm tracking-wide">
              Merchant Console Login
            </p>
          </div>

       
          <form className="space-y-6" onSubmit={handleLogin}>
            
    
            {errorMsg && (
              <div className="bg-red-500/20 border border-red-500/40 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-red-300 text-sm font-medium text-center">
                  {errorMsg}
                </p>
              </div>
            )}

        
            <div className="relative group">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors w-5 h-5" />
              
              <input
                type="email"
                className="
                  w-full pl-12 pr-4 py-4
                  bg-slate-800/50 border border-slate-700/80
                  rounded-2xl backdrop-blur-sm
                  text-slate-100 placeholder-slate-500
                  focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/80
                  transition-all duration-200
                "
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

 
            <div className="relative group">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors w-5 h-5" />
              
              <input
                type={showPass ? "text" : "password"}
                className="
                  w-full pl-12 pr-12 py-4
                  bg-slate-800/50 border border-slate-700/80
                  rounded-2xl backdrop-blur-sm
                  text-slate-100 placeholder-slate-500
                  focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/80
                  transition-all duration-200
                "
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="
                  absolute right-4 top-1/2 -translate-y-1/2
                  p-2 hover:bg-slate-700/50 rounded-xl
                  hover:scale-110 transition-all duration-200
                  text-slate-400 hover:text-teal-400
                "
              >
                {showPass ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
              </button>
            </div>

       
            <button
              type="submit"
              disabled={loading}
              className="
                w-full h-14 bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-500
                text-slate-950 font-bold rounded-2xl shadow-lg shadow-teal-500/40
                hover:from-teal-600 hover:to-emerald-600
                hover:shadow-teal-500/60 hover:scale-[1.02]
                disabled:from-slate-700 disabled:to-slate-800 disabled:shadow-none disabled:cursor-not-allowed disabled:scale-100
                transition-all duration-200 flex items-center justify-center gap-2
              "
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

   
          <div className="mt-8 pt-8 border-t border-slate-800/50 text-center">
            <p className="text-slate-500 text-sm">
              © 2026 QR Market. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
