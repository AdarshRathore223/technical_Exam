"use client";

import React, { useState } from "react";
import Done from "./Done";

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

type HandleChangeProps = {
  handleChange: (data: { url: string; original_name: string }) => void;
};

export default function DocumentUploader({ handleChange }: HandleChangeProps) {
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

      if (!response.ok) throw new Error("Failed to upload document");

      const data = await response.json();
      if (!data.publicId)
        throw new Error("Uploaded document error: publicId not found");

      setUploadedDocument(data.publicId);

      // Pass both URL and original file name as an object to `handleChange`
      handleChange({ url: data.url, original_name: file.name });
    } catch (error) {
      console.error(error);
      alert("Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="card">
        <div className="card-body">
          <div className="form-control flex w-2/3">
            <input
              type="file"
              accept=".pdf,.docx,.txt,.png,.jpeg,.jpg,.gif,.bmp,.svg,.webp,.tiff,.ico,.heic"
              onChange={handleFileUpload}
              className="file-input file-input-bordered file-input-primary w-full"
            />
            {isUploading && (
              <div className="flex justify-center items-center">
                <div className="w-5 h-5 border-y-2 border-solid rounded-full border-b-green-600 animate-spin" />
              </div>
            )}
            {uploadedDocument && <Done />}
          </div>
        </div>
      </div>
    </div>
  );
}
