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
    if (inputValue === "" || isNaN(inputValue)) {
      setError("Please enter a valid number.");
      return;
    }
    setScoreList([...scoreList, parseInt(inputValue)]);
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
      setError("Please enter at least one score.");
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
      setError("Failed to save score list.");
    }
  };

  return (
    <div className="set-score-container">
      <h1>Set Score List</h1>
      <p>Now setting score for racer in the {racerPosition} position</p>

      <div className="input-container">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter score"
        />
        <div className="button-group">
          <button onClick={handleAddScore}>Add Score</button>
          <button onClick={handleCancelLastScore} className="cancel-button">
            Cancel Last Score
          </button>
        </div>
      </div>

      <ul className="score-list">
        {scoreList.map((score, index) => (
          <li key={index}>{score}</li>
        ))}
      </ul>

      <button onClick={handleSubmit} className="next-button">
        Next
      </button>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default SetScoreList;