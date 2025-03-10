import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import "../css/Leaderboard.css";

function SeniorLeaderboard() {
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Track data loading
  const leaderboardRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:5000/api/show_senior_championship");
        if (!response.ok) throw new Error("Failed to fetch senior leaderboard");
        const data = await response.json();
        console.log("Senior Leaderboard API Response:", data); // Debugging
        setDrivers(data.senior_list || []); // Use senior_list, fallback to empty array
        setIsDataLoaded(true); // Mark data as loaded
      } catch (err) {
        console.error(err);
        setError("Error al cargar la tabla.");
      }
    }

    fetchData();
  }, []);

  const downloadImage = () => {
    if (!leaderboardRef.current) {
      console.error("Ref is not attached to an element.");
      return;
    }
  
    setTimeout(() => { // Add a slight delay
      html2canvas(leaderboardRef.current, {
        scale: 2, 
        useCORS: true,
        backgroundColor: null, // Ensure transparent background works
      })
        .then((canvas) => {
          const link = document.createElement("a");
          link.href = canvas.toDataURL("image/png");
          link.download = "leaderboard.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((err) => {
          console.error("Error generating image:", err);
          setError("Error al generar la imagen.");
        });
    }, 500); // Delay to allow rendering
  };

  const handleBack = () => {
    navigate("/ChampionshipTool");
  };

  return (
    <div className="leaderboard-page-container">
      <h1 className="leaderboard-title">Tabla senior</h1>
      {error && <p className="error-message">{error}</p>}

      {/* Leaderboard Table */}
      <div className="leaderboard-container" ref={leaderboardRef}>
        {drivers.length > 0 ? (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>POS.</th>
                <th>PILOTO</th>
                <th>PTOS.</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver, index) => (
                <tr key={index} className="leaderboard-row">
                  <td className="position">{index + 1}</td>
                  <td className="driver">
                    {typeof driver.Name === "string" ? driver.Name.toUpperCase() : "N/A"}
                  </td>
                  <td className="gap">{driver.Score || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No se encontraron pilotos senior.</p>
        )}
      </div>

      {/* Buttons */}
      <div className="button-group">
        <button
          onClick={downloadImage}
          className="action-button"
          disabled={!isDataLoaded} // Disable button until data loads
        >
          Descargar tabla
        </button>
        <button onClick={handleBack} className="action-button back-button">
          Volver
        </button>
      </div>
    </div>
  );
}

export default SeniorLeaderboard;