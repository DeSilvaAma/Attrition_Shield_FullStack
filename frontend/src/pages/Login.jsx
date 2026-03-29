import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // reset error on each submit

    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Safely parse JSON, even if response is bad
      let data;
      try {
        data = await res.json();
      } catch {
        data = { detail: "Invalid response from server" };
      }

      if (res.ok) {
        // Login successful → navigate
        navigate("/prediction");
      } else {
        // Handle known backend error
        if (data.detail === "Invalid email or password") {
          setError("No account found. Please sign up first.");
        } else {
          setError(data.detail || "Something went wrong. Try again.");
        }
      }
    } catch (err) {
      // Handle network or server errors
      setError("Cannot reach server. Check your backend or network.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Soft Mesh Background */}
      <div className="absolute inset-0 bg-[#f8fafc] z-0" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/60 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-100/60 blur-[120px]" />

      <div className="relative z-10 bg-white/40 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 max-w-md w-full border border-white/60">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800">Login</h2>
          <p className="text-slate-500 text-sm mt-2">Log in to manage your workforce data.</p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-slate-600 text-xs font-bold uppercase tracking-wider mb-2 ml-1" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="ex: jane@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 text-slate-800 placeholder-slate-400 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:bg-white transition-all duration-200 shadow-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="block text-slate-600 text-xs font-bold uppercase tracking-wider" htmlFor="password">
                Password
              </label>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 text-slate-800 placeholder-slate-400 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:bg-white transition-all duration-200 shadow-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-xl shadow-slate-200 transform transition active:scale-[0.98] hover:shadow-2xl"
          >
            Sign In
          </button>
        </form>

        {/* Error message */}
        {error && (
          <p className="text-center mt-4 text-red-600 font-semibold">
            {error}
          </p>
        )}

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

