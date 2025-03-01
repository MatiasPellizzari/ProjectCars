import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function SetParticipationScore() {
  const [participationScore, setParticipationScore] = useState(""); // Store user input
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigation

  const handleSubmit = async () => {
    if (!participationScore || isNaN(participationScore) || participationScore < 0) {
      setError("Please enter a valid participation score (positive number).");
      return;
    }

    try {
      // Make an API call to save the participation score
      const response = await axios.post("http://localhost:5000/api/set_participation_score", {
        participation_score: parseInt(participationScore, 10),
      });

      console.log("✅ Participation Score Set:", response.data);
      setError(""); // Clear any previous errors
      navigate("/StartChampionship");
    } catch (err) {
      console.error("❌ Failed to set participation score:", err);
      setError("Failed to set participation score.");
    }
  };

  return (
    <div>
      <h1>Set Participation Score</h1>
      <input
        type="number"
        value={participationScore}
        onChange={(e) => setParticipationScore(e.target.value)}
        placeholder="Enter participation score"
      />
      <button onClick={handleSubmit}>Save</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default SetParticipationScore;