import React, { useEffect, useState } from "react";

function AddSenior() {
    const [people, setPeople] = useState([]);  // List of people not in senior_list
    const [selectedPerson, setSelectedPerson] = useState(""); // Selected person
    const [message, setMessage] = useState(""); // Message to show response

    // Fetch available people from backend
    useEffect(() => {
        async function fetchPeople() {
            try {
                console.log("Fetching people...");
                const response = await fetch("http://localhost:5000/api/available_people");
    
                if (!response.ok) throw new Error("Failed to load people list.");
    
                const data = await response.json();
                console.log("API Response:", data);
    
                setPeople(data.available_people);
                setSelectedPerson(data.available_people[0] || "");
            } catch (error) {
                console.error("Error fetching people:", error);
                setMessage("Error fetching people list.");
            }
        }
    
        fetchPeople();
    }, []);

    const handleConfirm = () => {
        if (selectedPerson) {
            handleMoveToSenior(selectedPerson); // Calls the function from parent
            alert(`${selectedPerson.Name} has been moved to the Senior Leaderboard!`);
        } else {
            alert("Please select a player first.");
        }
    };

    // Function to move person to senior_list
    const handleMoveToSenior = async () => {
        if (!selectedPerson) {
            setMessage("No person selected.");
            return;
        }
    
        try {
            console.log("Sending name:", selectedPerson.Name); // Debugging log
    
            const response = await fetch("http://localhost:5000/api/move_to_senior", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: selectedPerson.Name }),  // ✅ Send only the name
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setMessage(data.message);
                setPeople(people.filter((p) => p.Name !== selectedPerson.Name)); // ✅ Ensure correct filtering
                setSelectedPerson(people.length > 1 ? people[1] : ""); // ✅ Select next or clear selection
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            console.error("Error moving to senior list:", error);
            setMessage("An error occurred.");
        }
    };

    return (
        <div>
            <h1>Move to Senior Leaderboard</h1>
            {people.length > 0 ? (
                <>
                    <select
                        value={selectedPerson ? selectedPerson.Name : ""}
                        onChange={(e) => {
                            const person = people.find(p => p.Name === e.target.value);
                            setSelectedPerson(person || null);
                        }}
                    >
                        {people.map((person, index) => (
                            <option key={index} value={person.Name}>
                                {person.Name} (Score: {person.Score}) 
                            </option>
                        ))}
                    </select>
                </>
            ) : (
                <p>No available people to move.</p>
            )}
            {message && <p>{message}</p>}

              {/* Confirm Button */}
            <button 
                onClick={() => handleConfirm(selectedPerson)}
                style={{
                    marginLeft: "10px",
                    padding: "8px 16px",
                    backgroundColor: "#000",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                }}
            >
                Confirm
            </button>
        </div>
    );
}

export default AddSenior;