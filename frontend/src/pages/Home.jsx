import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Transparent glass-style card */}
      <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-2xl p-4 sm:p-8 text-center w-full max-w-sm sm:max-w-md">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
          Employee Attrition Prediction
        </h1>
        <p className="text-white/90 mb-6 text-sm sm:text-base md:text-lg">
          Predict employee attrition and take proactive steps to retain top talent.
        </p>

        <Link
          to="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 sm:px-8 sm:py-3 rounded-lg text-sm sm:text-base shadow-md transition"
        >
          Start
        </Link>
      </div>
    </div>
  );
}

export default Home;