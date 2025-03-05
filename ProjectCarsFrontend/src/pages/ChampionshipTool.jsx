import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/ChampionshipTool.css"; // Import the updated CSS file

function ChampionshipTool() {
  const navigate = useNavigate();

  return (
    <div className="championship-tool-container">
      <h1 className="neon-title">Select One of the Following:</h1>
      <div className="button-grid">
        <button onClick={() => navigate("/UpdateChampionship")} className="neon-button">
          Update Championship
        </button>
        <button onClick={() => navigate("/DownloadFile")} className="neon-button">
          Download File
        </button>
        <button onClick={() => navigate("/Leaderboard")} className="neon-button">
          Leaderboard
        </button>
        <button onClick={() => navigate("/SeniorLeaderboard")} className="neon-button">
          Senior Leaderboard
        </button>
        <button onClick={() => navigate("/AddSenior")} className="neon-button">
          Add Senior
        </button>
        <button onClick={() => navigate("/")} className="neon-button">
          Volver al comienzo
        </button>
      </div>
    </div>
  );
}

export default ChampionshipTool;

