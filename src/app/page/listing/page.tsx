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
    if (isNaN(date.getTime())) return "N/A";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({ key: "", direction: "asc" });

  const {
    data: tableData,
    error,
    isLoading,
  } = useFetchData<TableRow[]>("/api/user");
  console.log(tableData);
  useEffect(() => {
    if (tableData) console.log("Fetched Data: ", tableData);
  }, [tableData]);

  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    column: string
  ) => {
    setFilters({ ...filters, [column]: e.target.value });
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Ensure tableData is an array before applying filter and sorting
  const filteredData = Array.isArray(tableData)
    ? tableData
        .filter((row) => {
          const matchesSearchTerm = Object.values(row).some((value) =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
          );

          const matchesFilters = columns.every(({ key }) => {
            const filterValue = filters[key];
            if (!filterValue) return true;
            return row[key as keyof TableRow]
              ?.toString()
              .toLowerCase()
              .includes(filterValue.toLowerCase());
          });

          return matchesSearchTerm && matchesFilters;
        })
        .sort((a, b) => {
          if (sortConfig.key) {
            const aValue = a[sortConfig.key as keyof TableRow];
            const bValue = b[sortConfig.key as keyof TableRow];
        
            // Handle null or undefined values
            if (aValue == null) return sortConfig.direction === "asc" ? 1 : -1;
            if (bValue == null) return sortConfig.direction === "asc" ? -1 : 1;
        
            // Convert values to strings for string comparison or numbers for numeric comparison
            const aString = aValue.toString();
            const bString = bValue.toString();
        
            // Check if both values are numeric
            const isNumeric = !isNaN(Number(aString)) && !isNaN(Number(bString));
            if (isNumeric) {
              return sortConfig.direction === "asc"
                ? Number(aString) - Number(bString)
                : Number(bString) - Number(aString);
            } else {
              // Alphabetical comparison for non-numeric values
              return sortConfig.direction === "asc"
                ? aString.localeCompare(bString)
                : bString.localeCompare(aString);
            }
          }
          return 0;
        })
        
    : [];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full bg-white border-gray-400 border rounded-t-lg select-none">
      <h1 className="text-xl bg-blue-400 p-2 text-white font-bold rounded-t-md w-auto ">
        Listing
      </h1>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-xs overflow-hidden table-auto border-collapse relative min-h-12">
          <thead>
            <tr>
              {columns.map(({ key, label }) => (
                <th key={key} className="text-[0.7rem]" onClick={() => handleSort(key)}>
                  {label}
                  {sortConfig.key === key && (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
                </th>
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
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                </th>
              ))}
              <th />
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="h-24 text-center text-xl font-bold"
                >
                  No Data Available
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-blue-50" : "bg-white"}`}
                >
                  {columns.map(({ key }) => (
                    <td key={key} className="text-center">
                      {key.includes("date")
                        ? formatDate(row[key as keyof TableRow] as string)
                        : row[key as keyof TableRow]?.toString() || null}
                    </td>
                  ))}
                 {row.link ?  <td className="text-center">
                    <a
                      href={row.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600"
                    >
                      View Scan
                    </a>
                  </td> :  <td className="text-center">
                    <div
                      className="text-blue-600"
                    >
                      Not Available
                    </div>
                  </td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
