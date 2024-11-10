"use client";
import React, { useEffect, useRef, useState } from "react";
import Input from "../../components/Input";
import DropdownInput from "../../components/DropdownInput";
import RadioButton from "../../components/RadioButton";
import Done from "@/app/components/Done";

type FormData = {
  uid: string | null;
  fundSource: string | null;
  fund_date: string | null;
  category: string | null;
  head: string | null;
  remark: string | null;
  vendor: string | null;
  amount: string | null;
  reference: string | null;
  debtReimbursement: string | null;
  reimbursement: string | null;
  reimbursementDate: string | null;
  comment: string | null;
  mime_type: string | null;
  new_filename: string | null;
  original_name: string | null;
};

const options = {
  fundSource: ["Source1", "Source2"],
  category: ["Category1", "Category2"],
  head: ["Head1", "Head2"],
  vendor: ["Vendor1", "Vendor2"],
  reimbursement: ["Option1", "Option2"],
};

const fieldNames = {
  fundSource: "Fund Source",
  fund_date: "Fund Date",
  amount: "Amount",
};

const generateUniqueId = (): string => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const Page: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [debtReimbursement, setDebtReimbursement] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<FormData>({
    uid: generateUniqueId(),
    fundSource: null,
    fund_date: null,
    category: null,
    head: null,
    remark: null,
    vendor: null,
    amount: null,
    reference: null,
    debtReimbursement: null,
    reimbursement: null,
    reimbursementDate: null,
    comment: null,
    mime_type: null,
    original_name: null,
    new_filename: null,
  });

  useEffect(() => {
    console.log("Form data updated:", formData);
  }, [formData]);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value || null }));
  };

  const handleDebtReimbursementChange = (value: string) => {
    setDebtReimbursement(value);
    handleInputChange("debtReimbursement", value);
  };

  const validateFormData = (): string[] =>
    Object.keys(fieldNames)
      .filter((field) => !formData[field as keyof FormData])
      .map((field) => fieldNames[field as keyof typeof fieldNames]);

  const handleFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const uploadFile = async () => {
    if (!uploadedFile) return;

    const mimeType = uploadedFile.type;
    const originalName = uploadedFile.name;
    const newFilename = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    setFormData({
      ...formData,
      mime_type: mimeType,
      original_name: originalName,
      new_filename: newFilename,
    });

    const data = new FormData();
    data.append("file", uploadedFile, newFilename);

    try {
      setIsUploading(true);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      console.log(result);
      setIsUploaded(true);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setResponseMessage(null);

    const missingFields = validateFormData();
    if (missingFields.length > 0) {
      setResponseMessage(`Error: Missing data for ${missingFields.join(", ")}`);
      setLoading(false);
      return;
    }

    await uploadFile();

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const message = response.ok
        ? "Data submitted successfully!"
        : `Error: ${(await response.json()).message || "Something went wrong"}`;
      setResponseMessage(message);
    } catch (error) {
      console.error("Error occurred:", error);
      setResponseMessage("Request failed: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white max-w-[50rem] pb-5 rounded-lg">
      <h1 className="text-xl text-white bg-green-400 font-bold p-2 rounded-t-md mb-5">Form</h1>

      <form onSubmit={handleSubmit} className="px-6">
        {/* Form Fields */}
        <div className="mb-4 flex gap-5 w-full">
          <DropdownInput
            name="fundSource"
            label="Fund Source"
            placeholder="Fund source"
            className="w-1/2"
            required
            charLimit={20}
            options={options.fundSource}
            onChange={(value) => handleInputChange("fundSource", value)}
          />
          <Input
            label="Expense Date"
            name="fund_date"
            required
            type="date"
            className="w-1/2"
            onChange={(e) => handleInputChange("fund_date", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-2">
          <DropdownInput
            name="category"
            label="Category"
            charLimit={20}
            placeholder="Select Category"
            required
            options={options.category}
            onChange={(value) => handleInputChange("category", value)}
          />
          <DropdownInput
            name="head"
            label="Expense Head"
            charLimit={20}
            placeholder="Select Head"
            required
            options={options.head}
            onChange={(value) => handleInputChange("head", value)}
          />
          <Input
            label="Remarks"
            name="remark"
            placeholder="Add Remark"
            className="col-span-2"
            onChange={(e) => handleInputChange("remark", e.target.value)}
            type="text"
          />
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-2 mt-5">
          <DropdownInput
            name="vendor"
            label="Paid To"
            required
            charLimit={20}
            placeholder="Paid To"
            options={options.vendor}
            onChange={(value) => handleInputChange("vendor", value)}
          />
          <Input
            label="Amount"
            name="amount"
            required
            charLimit={8}
            placeholder="Enter Amount"
            onChange={(e) => handleInputChange("amount", e.target.value)}
            type="number"
          />
          <Input
            label="Reference#"
            name="reference"
            required
            placeholder="Enter Reference ID"
            onChange={(e) => handleInputChange("reference", e.target.value)}
            type="text"
          />
        </div>

        {/* Debt Reimbursement Fields */}
        <RadioButton
          label="Is this expense eligible for reimbursement?"
          name="debtReimbursement"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          selectedValue={debtReimbursement}
          onChange={handleDebtReimbursementChange}
        />

        {debtReimbursement === "yes" && (
          <div className="grid grid-cols-2 gap-x-5">
            <DropdownInput
              required
              name="reimbursement"
              label="Reimburse From"
              placeholder="Reimburse From"
              charLimit={20}
              options={options.reimbursement}
              onChange={(value) => handleInputChange("reimbursement", value)}
            />
            <Input
              label="Reimbursement Date"
              name="reimbursementDate"
              type="date"
              onChange={(e) => handleInputChange("reimbursementDate", e.target.value)}
            />
            <Input
              label="Comments"
              name="comment"
              type="textarea"
              className="col-span-2"
              onChange={(e) => handleInputChange("comment", e.target.value)}
            />
          </div>
        )}

        {/* File Upload */}
        <div className="mb-4">
          <label htmlFor="scan" className="block text-sm font-medium text-gray-700">
            Scan <span className="text-red-600 font-extrabold">*</span>
          </label>
          <input
            ref={fileInputRef}
            onChange={handleFileChange}
            className="mt-1 block w-full"
            type="file"
            name="scan"
            id="scan"
          />
          {isUploading && <div>Uploading file...</div>}
        </div>

        {/* Submission Buttons and Response */}
        <div className="text-center mt-5">
          <button
            type="submit"
            className={`text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg px-4 py-2 ${
              loading ? "cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          {responseMessage && (
            <p className={`text-sm mt-2 ${responseMessage.startsWith("Error") ? "text-red-600" : "text-green-600"}`}>
              {responseMessage}
            </p>
          )}
          {isUploaded && <Done />}
        </div>
      </form>
    </div>
  );
};

export default Page;
