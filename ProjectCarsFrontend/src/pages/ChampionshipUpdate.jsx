import React, { useState } from "react";
import axios from "axios";
import "../css/Update.css"; 
import { useNavigate } from "react-router-dom";

function ChampionshipUpdate() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [unrecognizedDrivers, setUnrecognizedDrivers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setWarning("");
    setUnrecognizedDrivers([]);
    setLeaderboard([]);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a file before starting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/api/update_championship", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status === "warning") {
        setWarning(response.data.message);
        setUnrecognizedDrivers(response.data.unrecognized_drivers || []);
        setLeaderboard(response.data.leaderboard_names || []);
        return;
      }

      setError("");
      setWarning("");
      navigate("/ChampionshipTool");
    } catch (err) {
      console.error("Failed to update championship:", err);
      setError("Failed to update championship.");
    }
  };

  return (
    <div className="update-championship-container">
      <h1>Update Championship</h1>
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
      {warning && <p className="warning-message">{warning}</p>}
      {unrecognizedDrivers.length > 0 && (
        <div className="unrecognized-drivers-table">
          <h3>Unrecognized Drivers:</h3>
          <table>
            <thead>
              <tr>
                <th>Unrecognized Driver</th>
                <th>Closest Matches from Leaderboard</th>
              </tr>
            </thead>
            <tbody>
              {unrecognizedDrivers.map((driver, index) => (
                <tr key={index}>
                  <td>{driver.name}</td>
                  <td>{driver.closest_match || "No Match Found"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ChampionshipUpdate;
