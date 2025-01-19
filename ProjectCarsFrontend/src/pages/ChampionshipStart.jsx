import React, { useState } from "react";
import axios from "axios";

function ChampionshipStart() {
  const [file, setFile] = useState(null); // To store the selected file
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Update the state with the selected file
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a file before starting.");
      return;
    }

    // Create a FormData object to send the file to the backend
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Make an API call to your backend to start the championship
      const response = await axios.post("http://localhost:5000/start-championship", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle success response
      console.log("Championship started:", response.data);
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Failed to start championship:", err);
      setError("Failed to start championship.");
    }
  };

  return (
    <div>
      <h1>Start Championship</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Start</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default ChampionshipStart;