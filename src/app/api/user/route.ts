import { createConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Establish the database connection
    const db = await createConnection();

    if (!db) {
      console.log("Database connection failed.");
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    // Define the SQL query
    const sql = "SELECT * FROM user";

    // Use the Promise-based query method
    const [rows] = await db.query(sql);  // The result should be an array of rows

    // If no results found, return an empty array or an appropriate message
    if (rows.length === 0) {
      return NextResponse.json({ message: "No users found" });
    }

    // Return the query results as a JSON response
    return NextResponse.json(rows);

  } catch (error) {
    console.error("Error while fetching data:", error);
    return NextResponse.json({ error: error || "An error occurred" }, { status: 500 });
  }
}
