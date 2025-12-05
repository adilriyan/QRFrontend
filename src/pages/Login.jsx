import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { API } from "../api/api"; 
import { useNavigate } from "react-router-dom";

export default function Login() {

  // States
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  // -------------------
  //      LOGIN FN
  // -------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await API.post("/auth/login", { email, password });

      // Extract token from server
      const token = res.data.token;

      // Save token in browser
      localStorage.setItem("token", token);

      // After login redirect
      navigate("/");

    } catch (err) {
      console.error(err);

      // Server error message
      const msg = err?.response?.data?.error || "Login failed!";
      setErrorMsg(msg);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      {/* Center Card */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          QR Marketing Platform
        </h1>

        {/* FORM START */}
        <form className="space-y-5" onSubmit={handleLogin}>

          {/* ERROR MESSAGE */}
          {errorMsg && (
            <p className="text-red-600 text-center font-medium">{errorMsg}</p>
          )}

          {/* EMAIL INPUT */}
          <div>
            <label className="text-gray-600 block mb-1">Email</label>

            <input
              type="email"
              className="w-full p-3 border rounded-lg outline-teal-600"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD INPUT */}
          <div>
            <label className="text-gray-600 block mb-1">Password</label>

            <div className="relative">

              <input
                type={showPass ? "text" : "password"}
                className="w-full p-3 border rounded-lg pr-12 outline-teal-600"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
        {/* FORM END */}

      </div>
    </div>
  );
}
