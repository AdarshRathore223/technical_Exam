const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',    // MySQL host (use your database host, e.g., 'localhost' or an IP address)
  user: 'root',         // MySQL username
  password: '',         // MySQL password (leave blank if there's no password)
  database: 'technical',  // Name of your database
});

// Connect to the MySQL server
connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database');
});

// Data to be inserted into the database
const formData = {
  fundSource: 'External Funding',
  fund_date: '2024-11-01',
  category: 'Research',
  head: 'Operations',
  remark: 'No remarks',
  vendor: 'Vendor A',
  amount: '1000',
  reference: 'REF1234dfd56',
  debtReimbursement: 'yes',
  reimbursement: 'Company B',
  reimbursementDate: '2024-11-15',
  comment: 'Approved',
  scan: 'file_path_here',  // For simplicity, we're storing file path (for actual file uploads, handle accordingly)
};

// SQL query to insert data into the table
const query = `
  INSERT INTO user (
    Fund_sorce,
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
    org_filename
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

// Execute the SQL query
connection.query(query, [
  formData.fundSource,
  formData.fund_date,
  formData.category,
  formData.head,
  formData.remark,
  formData.vendor,
  formData.amount,
  formData.reference,
  formData.debtReimbursement,
  formData.reimbursement,
  formData.reimbursementDate,
  formData.comment,
  formData.scan,  // Assume scan is a file path or null if no file
], (err, results) => {
  if (err) {
    console.error('Error inserting data:', err);
  } else {
    console.log('Data inserted successfully:', results);
  }

  // Close the connection after query execution
  connection.end();
});
