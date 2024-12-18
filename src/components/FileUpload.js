import React, { useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes } from "firebase/storage";

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const fileRef = ref(storage, `monsters/${file.name}`);
    try {
      await uploadBytes(fileRef, file);
      alert("File uploaded successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>Upload Your Monster File</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUpload;