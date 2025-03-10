import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/ChampionshipResume.css"; // Import the new CSS file

function ChampionshipResume() {
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
      const response = await axios.post("http://localhost:5000/api/load_championship", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Championship resumed:", response.data);
      setError("");
      navigate("/ChampionshipTool");
    } catch (err) {
      console.error("Failed to resume championship:", err);
      setError("Failed to resume championship.");
    }
  };

  const handleBack = () => {
    navigate("/");
  };


  return (
    <div className="championship-resume-container">
      <h1>Continuar Campeonato</h1>
      <div className="file-input-container">
        <label htmlFor="file-input" className="file-input-label">
          {file ? file.name : "Seleccione Archivo"}
        </label>
        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
          className="file-input"
        />
      </div>
      <button onClick={handleSubmit} className="start-button">
        Continuar
      </button>
      <button onClick={handleBack} className="back-button">
        Volver
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default ChampionshipResume;