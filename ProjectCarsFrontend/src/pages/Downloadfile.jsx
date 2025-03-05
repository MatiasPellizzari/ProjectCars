import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../css/DownloadFile.css";

function DownloadFile() {
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const handleSendFileName = async () => {
    if (!fileName) {
      setMessage("Please enter a file name.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/download_file",
        { file_name: fileName },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "downloaded_file");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setMessage("File downloaded successfully.");
    } catch (err) {
      console.error("Failed to download file:", err);
      setMessage("Failed to download the file.");
    }
  };

  const handleBack = () => {
    navigate("/ChampionshipTool"); // Navigate back to ChampionshipTool
  };

  return (
    <div className="file-parameter-container">
      <h1 className="metal-title">File Parameter Tool</h1>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter file name"
          value={fileName}
          onChange={handleFileNameChange}
          className="metal-input"
        />
        <button onClick={handleSendFileName} className="metal-button">
          Use File
        </button>
        <button onClick={handleBack} className="metal-button-back">
          Back
        </button>
      </div>
      {message && (
        <p
          className={
            message.includes("Failed") ? "error-message" : "success-message"
          }
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default DownloadFile;