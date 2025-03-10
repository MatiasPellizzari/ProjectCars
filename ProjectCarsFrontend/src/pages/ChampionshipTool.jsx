import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/ChampionshipTool.css"; // Import the updated CSS file

function ChampionshipTool() {
  const navigate = useNavigate();

  return (
    <div className="championship-tool-container">
      <h1 className="neon-title">Seleccione uno de los siguientes:</h1>
      <div className="button-grid">
        <button onClick={() => navigate("/UpdateChampionship")} className="neon-button">
          Actualizar campeonato
        </button>
        <button onClick={() => navigate("/DownloadFile")} className="neon-button">
          Descargar archivo
        </button>
        <button onClick={() => navigate("/Leaderboard")} className="neon-button">
          Tabla General
        </button>
        <button onClick={() => navigate("/SeniorLeaderboard")} className="neon-button">
          Tabla senior
        </button>
        <button onClick={() => navigate("/AddSenior")} className="neon-button">
          Agregar Senior
        </button>
        <button onClick={() => navigate("/")} className="neon-button">
          Volver al comienzo
        </button>
      </div>
    </div>
  );
}

export default ChampionshipTool;

