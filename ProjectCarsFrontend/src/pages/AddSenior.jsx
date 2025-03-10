import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AddSenior.css"; // Import the new CSS file

function AddSenior() {
  const [people, setPeople] = useState([]); // List of people not in senior_list
  const [selectedPerson, setSelectedPerson] = useState(""); // Selected person's name
  const [message, setMessage] = useState(""); // Message to show response
  const navigate = useNavigate(); // For navigation

  // Fetch available people from backend
  useEffect(() => {
    async function fetchPeople() {
      try {
        console.log("Fetching people...");
        const response = await fetch("http://localhost:5000/api/available_people");

        if (!response.ok) throw new Error("Failed to load people list.");

        const data = await response.json();
        console.log("API Response (Full):", data); // Detailed logging for debugging
        console.log("Available People:", data.available_people);

        // Ensure people is an array and contains objects with Name and Score
        const availablePeople = Array.isArray(data.available_people) ? data.available_people : [];
        setPeople(availablePeople);
        setSelectedPerson(availablePeople[0]?.Name || ""); // Set the first person's Name as default
      } catch (error) {
        console.error("Error fetching people:", error);
        setMessage("Error fetching people list.");
      }
    }

    fetchPeople();
  }, []);

  // Handle moving the selected person to the senior list
  const handleConfirm = async () => {
    if (!selectedPerson) {
      setMessage("Please select a person first.");
      return;
    }

    try {
      console.log("Sending name:", selectedPerson);
      const response = await fetch("http://localhost:5000/api/move_to_senior", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: selectedPerson }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        // Remove the selected person from the list
        const updatedPeople = people.filter((p) => p.Name !== selectedPerson);
        setPeople(updatedPeople);
        // Set the next person as selected, or clear if none left
        setSelectedPerson(updatedPeople[0]?.Name || "");
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error("Error moving to senior list:", error);
      setMessage("An error occurred while moving to the senior list.");
    }
  };

  // Handle navigation back to Championship Tool
  const handleBack = () => {
    navigate("/ChampionshipTool");
  };

  return (
    <div className="add-senior-container">
      <h1 className="add-senior-title">Agregar Senior</h1>
      {people.length > 0 ? (
        <>
          <select
            value={selectedPerson}
            onChange={(e) => setSelectedPerson(e.target.value)}
            className="person-select"
          >
            {people.map((person, index) => (
              <option key={index} value={person.Name}>
                {person.Name} (Score: {person.Score || 0})
              </option>
            ))}
          </select>
          <div className="button-group">
            <button onClick={handleConfirm} className="confirm-button">
              Confirmar
            </button>
            <button onClick={handleBack} className="back-button">
              Volver
            </button>
          </div>
        </>
      ) : (
        <p className="no-people-message">No hay corredores disponibles para mover a senior.</p>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default AddSenior;