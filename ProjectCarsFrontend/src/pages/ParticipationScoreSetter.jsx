import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/SetParticipationScore.css"; // Import the new CSS file

function SetParticipationScore() {
  const [participationScore, setParticipationScore] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!participationScore || isNaN(participationScore) || participationScore < 0) {
      setError("Please enter a valid participation score (positive number).");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/set_participation_score", {
        participation_score: parseInt(participationScore, 10),
      });

      console.log("✅ Participation Score Set:", response.data);
      setError("");
      navigate("/StartChampionship");
    } catch (err) {
      console.error("❌ Failed to set participation score:", err);
      setError("Failed to set participation score.");
    }
  };

  return (
    <div className="set-participation-container">
      <h1>Set Participation Score</h1>
      <div className="input-container">
        <input
          type="number"
          value={participationScore}
          onChange={(e) => setParticipationScore(e.target.value)}
          placeholder="Enter participation score"
        />
      </div>
      <button onClick={handleSubmit} className="save-button">
        Save
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default SetParticipationScore;