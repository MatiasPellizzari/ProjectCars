import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/SetScoreList.css";

function SetScoreList() {
  const [scoreList, setScoreList] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [racerPosition, setRacerPosition] = useState(1); // Track racer position
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAddScore = () => {
    // Check if the input is empty or not a number
    if (inputValue === "" || isNaN(inputValue)) {
      setError("Please enter a valid number.");
      return;
    }

    const score = parseInt(inputValue);
    // Check if the score is positive (greater than 0)
    if (score < 0) {
      setError("Ingrese un numero positivo.");
      return;
    }

    // If valid, add the score to the list
    setScoreList([...scoreList, score]);
    setInputValue("");
    setError("");
    setRacerPosition(racerPosition + 1); // Increment racer position
  };

  const handleCancelLastScore = () => {
    if (scoreList.length === 0) {
      setError("No scores to cancel.");
      return;
    }
    const updatedScoreList = scoreList.slice(0, -1); // Remove the last score
    setScoreList(updatedScoreList);
    setRacerPosition(racerPosition - 1); // Decrement racer position
    setError("");
  };

  const handleSubmit = async () => {
    if (scoreList.length === 0) {
      setError("Por favor ingrese al menos un puntaje.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/set_score_list", {
        score_list: scoreList,
      });
      console.log("Score list saved:", scoreList);
      navigate("/SetParticipationScore");
    } catch (err) {
      console.error("Failed to save score list:", err);
      setError("Ocurrio un error.");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="set-score-container">
      <h1 className="set-score-title">Guardar puntajes por posicion</h1>
      <p className="racer-position">
        Ahora guardando puntaje para la posicion {racerPosition} y todas las siguientes 
      </p>

      <div className="input-container">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ingrese puntaje"
          className="score-input"
        />
        <div className="button-group">
          <button onClick={handleAddScore} className="add-score-button">
            Guardar puntaje
          </button>
          <button onClick={handleCancelLastScore} className="cancel-button">
            Cancelar ultimo puntaje
          </button>
        </div>
      </div>

      <ul className="score-list">
        {scoreList.map((score, index) => (
          <li key={index} className="score-item">{score}</li>
        ))}
      </ul>

      <button onClick={handleSubmit} className="next-button">
        Continuar
      </button>

      
      <button onClick={handleBack} className="back-button">
        Volver
      </button>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default SetScoreList;