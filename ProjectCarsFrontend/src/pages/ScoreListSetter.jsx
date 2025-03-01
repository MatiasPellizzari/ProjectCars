import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SetScoreList() {
  const [scoreList, setScoreList] = useState([]);
  const [inputValue, setInputValue] = useState("");
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
    <div>
      <h1>Set Score List</h1>
      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleAddScore}>Add Score</button>
      <ul>
        {scoreList.map((score, index) => (
          <li key={index}>{score}</li>
        ))}
      </ul>
      <button onClick={handleSubmit}>Next</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default SetScoreList;