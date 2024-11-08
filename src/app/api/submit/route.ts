import { createConnection } from "@/app/lib/db";

// Disable Next.js body parser to handle FormData
export const config = {
  api: {
    bodyParser: false,
  },
};
export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const {
      fundSource,
      fund_date,
      category,
      head,
      remark,
      vendor,
      amount,
      reference,
      debtReimbursement,
      reimbursement,
      reimbursementDate,
      comment,
      link,
      
    } = body;

    // Log the parsed data to verify
    console.log("Received form data:", body);

    // Create a MySQL connection
    const db = await createConnection();  // Wait for the connection

    // SQL query to insert data
    const query = `
      INSERT INTO user (
        Fund_source,
        fund_date,
        category,
        head,
        remark,
        paid_to,
        amount,
        RefrenceID,
        Reimberseable,
        Reimverse_from,
        Reimburse_date,
        comment,
        link
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Ensure the file is being handled properly, check if "scan" exists
    let file = null;


    // Log the query and values to verify before execution
    console.log("Executing query:", query);
    console.log("Query parameters:", [
      fundSource,
      fund_date,
      category,
      head,
      remark,
      vendor,
      amount,
      reference,
      debtReimbursement,
      reimbursement,
      reimbursementDate,
      comment,
      link,
    ]);

    // Execute the query using async/await for better handling
    const [result] = await db.execute(query, [
      fundSource,
      fund_date,
      category,
      head,
      remark,
      vendor,
      amount,
      reference,
      debtReimbursement,
      reimbursement,
      reimbursementDate,
      comment,
      link  // Ensure the file is correctly stored or handled
    ]);

    // Send success response
    return new Response(JSON.stringify({ message: "Form submitted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error Details: ", error);
    return new Response(
      JSON.stringify({ message: "Error saving data", error: error }),
      { status: 500 }
    );
  }
}
