"use client";

import React, { useState, useRef } from "react";

type DocumentFormat = 
  | "PDF" 
  | "DOCX" 
  | "TXT" 
  | "Other"
  | "PNG" 
  | "JPEG" 
  | "JPG" 
  | "GIF" 
  | "BMP" 
  | "SVG" 
  | "WEBP" 
  | "TIFF" 
  | "ICO"
  | "HEIC";


type FileUploadProps = {
  onFileUpload: (fileUrl: string) => void;
};

export default function DocumentUploader({ onFileUpload }: FileUploadProps) {
  const [uploadedDocument, setUploadedDocument] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to response upload document");

      const data = await response.json();
      setUploadedDocument(data.publicId);
      if (!data.publicId) {
        throw new Error("Uploaded document error: publicId not found");
      }

      setUploadedDocument(data.publicId); 

      console.log(data)
      onFileUpload(data.url);
    } catch (error) {
      console.log(error);
      alert("Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="card">
        <div className="card-body">
          <div className="form-control">
            <input
              type="file"
              accept=".pdf,.docx,.txt,.png,.jpeg,.jpg,.gif,.bmp,.svg,.webp,.tiff,.ico,.heic"
              onChange={handleFileUpload}
              className="file-input file-input-bordered file-input-primary w-full"
            />
          </div>

          {isUploading && (
            <div>
              <progress className="progress progress-primary w-full"></progress>
            </div>
          )}

          {uploadedDocument && (
            <div>
              <h2 className="card-title">Document Uploaded</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
