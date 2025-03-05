import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css"; 

function Home() {
  const navigate = useNavigate();

  return (
    <div className="championship-container">
      <h1>Bienvenidos al Asistente de Campeonatos</h1>
      <div className="button-container">
        <button onClick={() => navigate("/SetScores")}>Comenzar Campeonato</button>
        <button onClick={() => navigate("/ResumeChampionship")}>Reanudar Campeonato</button>
        <button onClick={() => navigate("/ChampionShipTool")}>Continuar Campeonato Ya Cargado</button>
      </div>
    </div>
  );
}

export default Home;