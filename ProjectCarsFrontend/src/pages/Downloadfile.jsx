import React, { useState } from "react";
import axios from "axios";

function FileParameterTool() {
  const [fileName, setFileName] = useState(""); // To store the file name input by the user
  const [message, setMessage] = useState(""); // To show success/error messages

  const handleFileNameChange = (e) => {
    setFileName(e.target.value); // Update the file name state
  };

  const handleSendFileName = async () => {
    if (!fileName) {
      setMessage("Please enter a file name."); // Display error if no file name is entered
      return;
    }

    try {
      // Make an API call to the backend with the file name as a parameter
      const response = await axios.post("http://localhost:5000/api/download_file", { file_name: fileName });

      // Handle success response
      setMessage(response.data.message || "Operation completed successfully.");
    } catch (err) {
      console.error("Failed to send file name to backend:", err);
      setMessage("Failed to process the file.");
    }
  };

  return (
    <div>
      <h1>File Parameter Tool</h1>
      {/* Input to type the file name */}
      <input
        type="text"
        placeholder="Enter file name"
        value={fileName}
        onChange={handleFileNameChange}
      />
      {/* Button to send the file name to the backend */}
      <button onClick={handleSendFileName}>Use File</button>
      {/* Display success or error messages */}
      {message && <p style={{ color: message.includes("Failed") ? "red" : "green" }}>{message}</p>}
    </div>
  );
}

export default FileParameterTool;