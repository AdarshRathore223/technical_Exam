"use client";
import { useRef, useState } from "react";
import Done from "./Done";

type handleChangeprops = {
  handleChange: (
    mime: string,
    original_name: string,
    new_filename: string
  ) => void;
};

export default function FileUpload({ handleChange }: handleChangeprops) {
  const [isloading, setIsloading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function uploadFile(evt: React.ChangeEvent<HTMLInputElement>) {
    const file = evt.target.files?.[0];

    if (!file) return;

    const mimeType = file.type;

    const originalName = file.name;
    const newFilename = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    handleChange(mimeType, originalName, newFilename);

    const formData = new FormData();
    formData.append("file", file, newFilename);

    try {
      setIsloading(true);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      console.log(result);
      setIsUploaded(true);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsloading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <label>
        <input type="file" name="file" ref={fileInput} onChange={uploadFile} />
        {isloading && (
          <div className="flex justify-center items-center">
            <div className="w-5 h-5 border-y-2 border-solid rounded-full border-b-green-600 animate-spin" />
          </div>
        )}

        {isloading && true && (
          <div className="flex justify-center items-center">
            <div className="w-5 h-5 border-y-2 border-solid rounded-full border-b-green-600 animate-spin" />
          </div>
        )}

        {isUploaded && (<Done/>)}
      </label>
    </div>
  );
}
