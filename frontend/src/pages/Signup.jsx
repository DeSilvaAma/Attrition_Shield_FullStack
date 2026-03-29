import React, { useState } from 'react';

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false); // track if message is error

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage(""); // reset previous message
    setIsError(false);

    try {
      const res = await fetch("http://127.0.0.1:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Signup successful! You can now log in.");
        setIsError(false);
      } else {
        // Check if backend says email exists
        if (data.detail === "User already exists") {
          setMessage("This email is already registered. Try logging in.");
        } else {
          setMessage(data.detail || "Something went wrong.");
        }
        setIsError(true);
      }
    } catch (err) {
      setMessage("Cannot reach server. Please try again later.");
      setIsError(true);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">

      <div className="absolute inset-0 bg-[#f8fafc] z-0" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/60 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-100/60 blur-[120px]" />

      <div className="relative z-10 bg-white/40 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 max-w-md w-full border border-white/60">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800">Create Account</h2>
          <p className="text-slate-500 text-sm mt-2">Start analyzing workforce retention today.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSignup}>

          <div>
            <label className="block text-slate-600 text-xs font-bold uppercase tracking-wider mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="ex: jane@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 text-slate-800 placeholder-slate-400 
              border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 
              focus:ring-blue-400/30 focus:bg-white transition-all duration-200 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-slate-600 text-xs font-bold uppercase tracking-wider mb-2 ml-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 text-slate-800 placeholder-slate-400 
              border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 
              focus:ring-blue-400/30 focus:bg-white transition-all duration-200 shadow-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold 
            py-3.5 rounded-xl shadow-xl shadow-slate-200 transform transition 
            active:scale-[0.98] hover:shadow-2xl"
          >
            Sign Up
          </button>
        </form>

        {/* Show success or error message */}
        {message && (
          <p className={`text-center mt-4 text-sm font-semibold ${isError ? "text-red-600" : "text-blue-600"}`}>
            {message}
          </p>
        )}

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Already have an account? <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Sign in</a>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Signup;

