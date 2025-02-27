import React, { useEffect, useState, useRef } from "react";
import "../css/Leaderboard.css"; 
import html2canvas from "html2canvas";

function Leaderboard() {
    const [drivers, setDrivers] = useState([]); // State to hold driver data
    const [error, setError] = useState(""); // State to hold error messages
    const leaderboardRef = useRef(null); // Reference for capturing screenshot

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("http://localhost:5000/api/show_championship");
                if (!response.ok) throw new Error("Failed to fetch leaderboard");
                const data = await response.json();
                setDrivers(data.championship_list);
            } catch (err) {
                console.error(err);
                setError("Failed to load leaderboard.");
            }
        }

        fetchData();
    }, []);

    // Function to capture and download the leaderboard as an image
    const downloadImage = () => {
        if (leaderboardRef.current) {
            html2canvas(leaderboardRef.current).then((canvas) => {
                const link = document.createElement("a");
                link.href = canvas.toDataURL("image/png");
                link.download = "leaderboard.png";
                link.click();
            });
        }
    };

    return (
        <div>
            <h1>Leaderboard</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            
            {/* Leaderboard Section */}
            <div ref={leaderboardRef} className="leaderboard-container">
                <ul className="leaderboard">
                    {drivers.map((driver, index) => (
                        <li key={index} className="leaderboard-item">
                            <span className="number">{index + 1})</span>
                            <span className="name">{driver.Name}</span>
                            <span className="score">{driver.Score || "N/A"}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Download Button */}
            <button onClick={downloadImage} className="download-button">
                Download Leaderboard
            </button>
        </div>
    );
}

export default Leaderboard;
