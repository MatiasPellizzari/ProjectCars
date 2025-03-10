import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/SetParticipationScore.css"; // Import the new CSS file

function SetParticipationScore() {
  const [participationScore, setParticipationScore] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // Check if the input is empty, not a number, or negative
    if (!participationScore || isNaN(participationScore) || parseInt(participationScore, 10) < 0) {
      setError("Ingrese un valor positivo.");
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
      setError("Ocurrio un error.");
    }
  };

  return (
    <div className="set-participation-container">
      <h1 className="set-participation-title">Configurar puntos por participacion</h1>
      <div className="input-container">
        <input
          type="number"
          value={participationScore}
          onChange={(e) => setParticipationScore(e.target.value)} // Fixed typo: setInputValue -> setParticipationScore
          placeholder="Ingrese aqui el valor."
          className="participation-input"
        />
      </div>
      <button onClick={handleSubmit} className="save-button">
        Guardar
      </button>
      <h2 className="set-participation-title">si no hay puntos por participacion, guarde un cero</h2>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default SetParticipationScore;