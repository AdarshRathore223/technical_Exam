"use client";
import React, { useEffect, useState } from "react";
import Input from "../../components/Input";
import DropdownInput from "../../components/DropdownInput";
import RadioButton from "../../components/RadioButton";
import FileUpload from "../../components/FileUpload";

type FormData = {
  uid: string;
  fundSource: string;
  fund_date: string;
  category: string;
  head: string;
  remark: string;
  vendor: string;
  amount: string;
  reference: string;
  debtReimbursement: string;
  reimbursement: string;
  reimbursementDate: string;
  comment: string;
  link: string;
  original_name: string;
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
  // category: "Category",
  // head: "Head",
  // vendor: "Paid To",
  amount: "Amount",
  // reference: "Reference",
  // debtReimbursement: "Debt Reimbursement",
  // reimbursement: "Reimbursement From",
  // link: "Document",
};

const generateUniqueId = (): string =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const page: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [debtReimbursement, setDebtReimbursement] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    uid: generateUniqueId(),
    fundSource: "",
    fund_date: "",
    category: "",
    head: "",
    remark: "",
    vendor: "",
    amount: "",
    reference: "",
    debtReimbursement: "",
    reimbursement: "",
    reimbursementDate: "",
    comment: "",
    link: "",
    original_name: "",
  });

  useEffect(() => {
    console.log("formData updated:", formData);
  }, [formData]);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDebtReimbursementChange = (value: string) => {
    setDebtReimbursement(value);
    handleInputChange("debtReimbursement", value);
  };

  const validateFormData = (): string[] => {
    return Object.keys(fieldNames).filter(
      (field) => !formData[field as keyof FormData]
    ).map((field) => fieldNames[field as keyof typeof fieldNames]);
  };

  const handleDocumentChange = (data: { url: string; original_name: string }) => {
    setFormData((prev) => ({
      ...prev,
      link: data.url,
      original_name: data.original_name,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setResponseMessage(null);

    const missingFields = validateFormData();
    if (missingFields.length > 0) {
      setResponseMessage(
        `Error: Missing data for the following fields: ${missingFields.join(", ")}`
      );
      setLoading(false);
      return;
    }

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
      <h1 className="text-xl text-white bg-green-400 font-bold p-2 rounded-t-md mb-5">
        Form
      </h1>

      <form onSubmit={handleSubmit} className="px-6">
        {/* Fund Source and Date */}
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

        {/* Category, Head, Remark */}
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

        {/* Vendor, Amount, Reference */}
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

        {/* Reimbursement Options */}
        <div className={debtReimbursement === "yes" ? "grid grid-cols-2 gap-x-5" : ""}>
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
            <>
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
                onChange={(e) =>
                  handleInputChange("reimbursementDate", e.target.value)
                }
              />
              <Input
                label="Comments"
                name="comment"
                type="textarea"
                className="col-span-2"
                onChange={(e) => handleInputChange("comment", e.target.value)}
              />
            </>
          )}
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label htmlFor="scan" className="block text-sm font-medium text-gray-700">
            Scan <span className="text-red-600 font-extrabold">*</span>
          </label>
          <FileUpload handleChange={handleDocumentChange} />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-4 py-3 text-center text-sm font-bold text-white bg-green-500 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {/* Response Message */}
      {responseMessage && (
        <div
          className={`mt-4 text-center text-sm font-semibold py-2 m-5 px-4 rounded-md ${
            responseMessage.startsWith("Error")
              ? "text-red-600 bg-red-100"
              : "text-green-600 bg-green-100"
          }`}
        >
          {responseMessage}
        </div>
      )}
    </div>
  );
};

export default page;
