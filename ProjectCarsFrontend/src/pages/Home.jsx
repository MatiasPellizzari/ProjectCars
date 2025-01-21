import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to the Championship Manager</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button onClick={() => navigate("/StartChampionship")}>
          Start Championship
        </button>
        <button onClick={() => navigate("/ResumeChampionship")}>
          Resume Championship
        </button>
      </div>
    </div>
  );
}

export default Home;