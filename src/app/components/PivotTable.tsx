"use client";
import React, { useEffect, useRef, useState } from "react";
import * as WebDataRocks from "@webdatarocks/react-webdatarocks";
import "@webdatarocks/webdatarocks/webdatarocks.min.css";
import { useFetchData } from "../hooks/useFetchData";

const PivotTable: React.FC = () => {
  const ref = useRef<WebDataRocks.Pivot | null>(null);
  const [data, setData] = useState<any[]>([]); // State to hold data from API
  const { data: tableData, error, isLoading } = useFetchData("/api/user"); // Fetch from your API
  const [isPivotReady, setIsPivotReady] = useState(false); // Track if pivot is ready

  useEffect(() => {
    if (Array.isArray(tableData)) {
      setData(tableData); // Update state only if tableData is an array
    }
  }, [tableData]);

  // Report configuration for WebDataRocks
  const report = {
    dataSource: {
      data: data, // Pass the fetched data here
    },
    slice: {
      rows: [
        { field: "fundSource" },
        { field: "category" },
      ],
      columns: [{ field: "date" }],
      measures: [
        { field: "amount", aggregator: "sum", caption: "Total Amount" },
      ],
    },
  };

  // Check if pivot instance is ready before setting report
  useEffect(() => {
    const pivot = ref.current?.webdatarocks;

    // Wait for pivot instance to be ready
    if (pivot) {
      setIsPivotReady(true);

      if (data.length > 0) {
        try {
          pivot.setReport(report);
        } catch (e) {
          console.warn("Report could not be set due to an internal error:", e);
        }
      }

      const onReportComplete = () => {
        pivot.off("reportcomplete", onReportComplete); // Cleanup the event listener
      };

      pivot.on("reportcomplete", onReportComplete);

      return () => {
        pivot.off("reportcomplete", onReportComplete);
      };
    }
  }, [data]); // Re-run when data changes

  // Display loading and error messages
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <WebDataRocks.Pivot
      ref={ref}
      toolbar={false}
      width="100%"
      report={isPivotReady && data.length > 0 ? report : undefined} // Only set report if pivot is ready and data is loaded
    />
  );
};

export default PivotTable;
