import React from "react";
import { useNavigate } from "react-router-dom";

function ChampionshipTool() {
      const navigate = useNavigate();
    return (
        <div>
          <h1>Select one of the following:</h1>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button onClick={() => navigate("/UpdateChampionship")}>
              Update Championship
            </button>
            <button onClick={() => navigate("/DownloadFile")}>
               Download File
            </button>
            <button onClick={() => navigate("/Leaderboard")}>
                Leaderboard
            </button>
          </div>
        </div>
      );
}

export default ChampionshipTool