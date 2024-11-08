"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import { useFetchData } from "@/app/hooks/useFetchData";

interface TableRow {
  amount: number;
  date: string;
  fundSource: string;
  category: string;
  head: string;
  remarkes: string;
  paidTo: string;
  reference: string;
  isReimb: string;
  reimbFrom: string;
  comments: string;
  reimbDate: string;
  link: string;
}

const columns = [
  { key: "Amount", label: "Amount", filterType: "input" },
  { key: "Fund_date", label: "Date", filterType: "input" },
  {
    key: "Fund_source",
    label: "Fund Source",
    filterType: "select",
    options: ["General Fund", "Special Fund"],
  },
  {
    key: "Category",
    label: "Category",
    filterType: "select",
    options: ["Operational", "Marketing"],
  },
  { key: "Head", label: "Head", filterType: "input" },
  { key: "Remark", label: "Remarks", filterType: "input" },
  { key: "Paid_to", label: "Paid To", filterType: "input" },
  { key: "RefrenceID", label: "Reference #", filterType: "input" },
  {
    key: "Reimberseable",
    label: "Is Reimburseable",
    filterType: "select",
    options: ["Yes", "No"],
  },
  { key: "Reimverse_from", label: "Reimbursed From", filterType: "input" },
  { key: "Comment", label: "Comments", filterType: "input" },
  { key: "Reimburse_date", label: "Reimbursement Date", filterType: "input" },
];

const DataTable: React.FC = () => {
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toISOString().split("T")[0];
  };

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const { data: tableData, error, isLoading } = useFetchData<TableRow[]>("/api/user");
  console.log(tableData)
  useEffect(() => {
    if (tableData) console.log("Fetched Data: ", tableData);
  }, [tableData]);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, column: string) => {
    setFilters({ ...filters, [column]: e.target.value });
  };

  

  // Ensure tableData is an array before applying filter
  const filteredData = Array.isArray(tableData)
    ? tableData.filter((row) => {
        const matchesSearchTerm = Object.values(row).some(
          (value) => value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

        const matchesFilters = columns.every(({ key }) => {
          const filterValue = filters[key];
          if (!filterValue) return true;
          return row[key as keyof TableRow]?.toString().toLowerCase().includes(filterValue.toLowerCase());
        });

        return matchesSearchTerm && matchesFilters;
      })
    : [];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (filteredData.length === 0) return <div>No data available</div>;

  return (
    <div className="w-full bg-white border-gray-400 border rounded-t-lg ">
      <h1 className="text-xl bg-blue-400 p-2 text-white font-bold rounded-t-md w-auto ">Listing</h1>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-xs overflow-hidden table-auto border-collapse">
          <thead>
            <tr>
              {columns.map(({ key, label }) => (
                <th key={key} className="text-[0.7rem]">{label}</th>
              ))}
              <th className="text-[0.5rem]">Scan</th>
            </tr>
            <tr>
              {columns.map(({ key, filterType, options }) => (
                <th key={key} className="text-[0.5rem]">
                  {filterType === "input" ? (
                    <input
                      type="text"
                      placeholder={`Filter ${key}`}
                      value={filters[key] || ""}
                      onChange={(e) => handleFilterChange(e, key)}
                      className="w-full text-center"
                    />
                  ) : (
                    <select
                      value={filters[key] || ""}
                      onChange={(e) => handleFilterChange(e, key)}
                      className="text-center w-full"
                    >
                      <option value="">All</option>
                      {options?.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                </th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                {columns.map(({ key }) => (
                  <td
                    key={key}
                    className={`text-center ${index % 2 === 0 ? "bg-blue-50" : "bg-white"}`}
                  >
                    {key.includes("date")
                      ? formatDate(row[key as keyof TableRow] as string)
                      : row[key as keyof TableRow]?.toString() || "N/A"}
                  </td>
                ))}
                <td className={`text-center ${index % 2 === 0 ? "bg-blue-50" : "bg-white"}`}>
                  <a href={row.link} target="_blank" className="text-blue-600">View Scan</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
