import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/ChampionshipStart.css"; // Import the new CSS file

function ChampionshipStart() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a file before starting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/api/begin_championship", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Championship started:", response.data);
      setError("");
      navigate("/ChampionshipTool");
    } catch (err) {
      console.error("Failed to start championship:", err);
      setError("Failed to start championship.");
    }
  };

  return (
    <div className="championship-start-container">
      <h1>Start Championship</h1>
      <div className="file-input-container">
        <label htmlFor="file-input" className="file-input-label">
          {file ? file.name : "Select Archive"}
        </label>
        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
          className="file-input"
        />
      </div>
      <button onClick={handleSubmit} className="start-button">
        Start
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default ChampionshipStart;