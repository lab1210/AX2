"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";

const VerifyCV = () => {
  const [uploadedFile, setUploadedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setUploadedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "application/pdf, application/msword",
    maxFiles: 1,
  });

  return (
    <div className="px-8 py-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Upload CV</h3>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-gray-500 ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {uploadedFile ? (
          <div className="flex items-center">
            <FiUpload className="mr-2 text-green-500" size={20} />
            <span>{uploadedFile.name}</span>
          </div>
        ) : (
          <>
            <FiUpload size={32} className="mb-2" />
            <p className="text-sm">Upload CV as a PDF or Word File</p>
            <button
              type="button"
              className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Browse File
            </button>
          </>
        )}
      </div>
      {uploadedFile && (
        <p className="mt-2 text-sm text-gray-600">
          File uploaded successfully.
        </p>
      )}
    </div>
  );
};

export default VerifyCV;
