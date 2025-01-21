import React, { useEffect, useState } from "react";
import "../css/Leaderboard.css"; // If it's in src/css/
function Leaderboard() {
    const [drivers, setDrivers] = useState([]); // State to hold driver data
    const [error, setError] = useState(""); // State to hold error messages

    useEffect(() => {
        // Fetch the championship data when the component is mounted
        async function fetchData() {
            try {
                const response = await fetch("http://localhost:5000/api/show_championship");
                if (!response.ok) throw new Error("Failed to fetch leaderboard");
                const data = await response.json();
                setDrivers(data.championship_list); // Update the state with driver data
            } catch (err) {
                console.error(err);
                setError("Failed to load leaderboard.");
            }
        }

        fetchData();
    }, []); // Empty dependency array ensures this runs only once

    return (
        <div>
            <h1>Leaderboard</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul className="leaderboard">
                {drivers.map((driver, index) => (
                    <li key={index} className="leaderboard-item">
                        <span className="number">{index + 1})</span>
                        <span className="name">{driver.name}</span>
                        <span className="city">{driver.city}</span>
                        <span className="besttime">{driver.best_time.toFixed(2)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Leaderboard;