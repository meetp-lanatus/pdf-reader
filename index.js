const path = require("path");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { OrderData, InvoiceData } = require("./controller");
const app = express();
const port = 3000;
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static(path.join(__dirname, ".", "dist")));
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "pdf"));
  },
  filename: function (req, file, cb) {
    cb(null, +Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), async (req, res) => {
  console.log(req.file);
  res.send("File uploaded successfully!");
});

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, ".", "dist", "index.html"));
});

app.get("/api/order", async (_, res) => {
  try {
    const result = await OrderData();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching order data:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching order data" });
  }
});

app.get("/api/invoice", async (_, res) => {
  try {
    const result = await InvoiceData();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching invoice data:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching invoice data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
