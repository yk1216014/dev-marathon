const path = require("path");
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

const port = 5465;

const cors = require("cors");
app.use(cors());

const { Pool } = require("pg");
const dbHost = process.env.DB_HOST || "localhost";

// Docker environment (Local) uses 'db' hostname and '5465' credentials
// Staging environment uses 'localhost' and specific user credentials
let dbUser = process.env.DB_USER;
let dbName = process.env.DB_NAME;
let dbPass = process.env.DB_PASSWORD;

if (!dbUser) {
  if (dbHost === 'db') {
    dbUser = "5465";
    dbName = "5465";
    dbPass = "5465";
  } else {
    // Fallback for Staging (localhost)
    dbUser = "user_kento_yokoyama";
    dbName = "db_kento_yokoyama";
    dbPass = "5Rw5YDaWc5jc";
  }
}

const pool = new Pool({
  user: dbUser,
  host: dbHost,
  database: dbName,
  password: dbPass,
  port: 5432,
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const apiRouter = express.Router();

apiRouter.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers");
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post("/add-customer", async (req, res) => {
  try {
    const { companyName, industry, contact, location } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [companyName, industry, contact, location]
    );
    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await pool.query("SELECT * FROM customers WHERE customer_id = $1", [id]);
    if (customer.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(customer.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post("/update-customer", async (req, res) => {
  try {
    const { id, companyName, industry, contact, location } = req.body;
    const updatedCustomer = await pool.query(
      "UPDATE customers SET company_name = $1, industry = $2, contact = $3, location = $4 WHERE customer_id = $5 RETURNING *",
      [companyName, industry, contact, location, id]
    );
    res.json({ success: true, customer: updatedCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.delete("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM customers WHERE customer_id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Mount the API router on root (for localhost) and /api_* (for staging with prefix)
app.use("/", apiRouter);
app.use(/\/api_[^\/]+/, apiRouter);

app.use(express.static(path.join(__dirname, "../web")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../web/index.html"));
});
