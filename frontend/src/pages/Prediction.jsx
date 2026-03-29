import React, { useState } from "react";
import axios from "axios";

function Prediction() {
  const [formData, setFormData] = useState({
    job: "Software Engineer",
    rating: 3,
    career: 3,
    comp: 3,
    culture: 3,
    diversity: 3,
    senior: 3,
    wlb: 3,
    recommend: "v",
    ceo: "v",
    outlook: "v",
    worked_years: "more than 1 year",
    title: "",
    pros: "",
    cons: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // error state
  const [error, setError] = useState("");

  const ratingFields = [
    { id: "rating", label: "Overall Rating" },
    { id: "career", label: "Career Opportunities" },
    { id: "comp", label: "Compensation & Benefits" },
    { id: "culture", label: "Culture & Values" },
    { id: "diversity", label: "Diversity & Inclusion" },
    { id: "senior", label: "Senior Management" },
    { id: "wlb", label: "Work/Life Balance" },
  ];

  const opinionOptions = [
    { value: "v", label: "Positive" },
    { value: "r", label: "Mild" },
    { value: "x", label: "Negative" },
    { value: "o", label: "No opinion" },
  ];

  const workedYearOptions = [
    "less than 1 year",
    "more than 1 year",
    "more than 3 year",
    "more than 5 year",
    "more than 8 year",
    "more than 10 year",
  ];

  const jobRoles = [
    "Software Engineer",
    "Senior Software Engineer",
    "Director",
    "Manager",
    "Consultant",
    "Data & Analyst",
    "Sales",
    "Crew Member",
  ];

  // VALIDATION LOGIC
  const handlePredict = async (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.pros.trim() ||
      !formData.cons.trim()
    ) {
      setError("Please fill all required fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/predict",
        formData
      );
      setPrediction(res.data);
    } catch (err) {
      console.error(err);
      alert("Backend error! Make sure FastAPI server is running.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6 pt-24 bg-slate-50">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Employee Attrition Prediction
      </h1>

      <form
        onSubmit={handlePredict}
        className="space-y-6 bg-white p-6 rounded-xl shadow max-w-5xl w-full mx-auto"
      >
        {/* TOP ERROR MESSAGE */}
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-center font-semibold">
            ⚠️ {error}
          </div>
        )}

        {/* Job Role & Tenure */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Job Role</label>
            <select
              value={formData.job}
              onChange={(e) =>
                setFormData({ ...formData, job: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              {jobRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">
              Worked Years
            </label>
            <select
              value={formData.worked_years}
              onChange={(e) =>
                setFormData({ ...formData, worked_years: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              {workedYearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ratings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ratingFields.map((f) => (
            <div key={f.id} className="flex flex-col mb-4">
              <label className="mb-1 font-medium">
                {f.label}: {formData[f.id]}
              </label>

              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={formData[f.id]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [f.id]: Number(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>
          ))}
        </div>

        {/* Opinion dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["recommend", "ceo", "outlook"].map((f) => (
            <div key={f}>
              <label className="block mb-1 font-semibold">
                {f === "recommend"
                  ? "Recommend"
                  : f === "ceo"
                  ? "CEO Approval"
                  : "Business Outlook"}
              </label>

              <select
                value={formData[f]}
                onChange={(e) =>
                  setFormData({ ...formData, [f]: e.target.value })
                }
                className="w-full p-2 border rounded"
              >
                {opinionOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* FEEDBACK FIELDS WITH FIELD ERROR */}
        {["title", "pros", "cons"].map((f) => (
          <div key={f}>
            <label className="block mb-1 font-semibold">
              {f.charAt(0).toUpperCase() + f.slice(1)}

              {f === "title" && (
                <div className="text-xs sm:text-sm text-gray-500 font-normal">
                  (Short summary of the review)
                </div>
              )}
            </label>

            {f === "title" ? (
              <input
                type="text"
                value={formData[f]}
                onChange={(e) =>
                  setFormData({ ...formData, [f]: e.target.value })
                }
                className={`w-full p-2 border rounded mb-1 ${
                  error && !formData[f].trim()
                    ? "border-red-500"
                    : ""
                }`}
              />
            ) : (
              <textarea
                value={formData[f]}
                onChange={(e) =>
                  setFormData({ ...formData, [f]: e.target.value })
                }
                className={`w-full p-2 border rounded mb-1 ${
                  error && !formData[f].trim()
                    ? "border-red-500"
                    : ""
                }`}
              />
            )}

            {/* FIELD ERROR MESSAGE */}
            {error && !formData[f].trim() && (
              <p className="text-red-500 text-sm">
                This field is required
              </p>
            )}
          </div>
        ))}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="w-50 bg-indigo-900 text-white p-3 rounded font-bold"
          >
            {loading ? "Predicting..." : "Run Prediction"}
          </button>
        </div>
      </form>

      {/* Prediction Results */}
      {prediction && (
        <div className="mt-6 bg-white p-4 rounded shadow max-w-5xl w-full mx-auto">
          <h2 className="text-xl font-bold mb-2">Prediction</h2>

          <p>
            Stay Probability:{" "}
            <strong>
              {(prediction.stay_probability * 100).toFixed(1)}%
            </strong>
          </p>

          <p>
            Attrition Risk:{" "}
            <strong>
              {(prediction.attrition_risk * 100).toFixed(1)}%
            </strong>
          </p>

          <h3 className="mt-4 font-bold">Feature Contributions</h3>
          <ul className="list-disc list-inside">
            {prediction.impact_scores.map((f) => (
              <li key={f.feature}>
                {f.feature}: {f.impact}
              </li>
            ))}
          </ul>

          {prediction.waterfall_plot && (
            <div className="mt-6">
              <h3 className="font-bold mb-2">
                SHAP Waterfall Explanation
              </h3>

              <img
                src={`${prediction.waterfall_plot}?t=${new Date().getTime()}`}
                alt="SHAP Waterfall Plot"
                className="border rounded shadow w-1/2 mx-auto"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Prediction;

