import { createConnection } from "@/app/lib/db";

// Disable Next.js body parser to handle FormData
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      uid,
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
      mime_type,
      original_name,
      new_filename,
    } = body;

    console.log("Received form data:", body);

    const db = await createConnection();

    const query = `
      INSERT INTO user (
        uid,
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
        mime_type,
        original_name,
        new_filename
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    console.log("Executing query:", query);
    console.log("Query parameters:", [
      uid,
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
      mime_type,
      original_name,
      new_filename,
    ]);

    const [result] = await db.execute(query, [
      uid,
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
      mime_type,
      original_name,
      new_filename,
    ]);

    return new Response(
      JSON.stringify({ message: "Form submitted successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error Details: ", error);
    return new Response(
      JSON.stringify({ message: "Error saving data", error: error }),
      { status: 500 }
    );
  }
}
