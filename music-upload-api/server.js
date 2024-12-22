// const express = require("express");
// const multer = require("multer");
// const path = require("path");

// const app = express();

// // Multer Configuration
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       const uploadPath = path.join(__dirname, "uploads");
//       cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//       const uniqueName = `${Date.now()}-${file.originalname}`;
//       cb(null, uniqueName);
//     },
//   });
  
//   const upload = multer({ storage });
  
//   // Serve Uploaded Files
//   app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  
//   // Handle File Upload
//   app.post("/upload-music", upload.single("file"), async (req, res) => {
//     const file = req.file;
//     const { title, type } = req.body; // Extract title and type from request body
  
//     if (!file || !title || !type) {
//       return res.status(400).json({ message: "Missing required fields or file" });
//     }
  
//     const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
  
//     try {
//       // Insert metadata into ArtistMusicLibrary
//       const query = `
//         INSERT INTO ArtistMusicLibrary (title, type, file_url, created_at)
//         VALUES (?, ?, ?, NOW())
//       `;
//       await db.query(query, [title, type, fileUrl]);
  
//       res.status(201).json({
//         message: "File uploaded and metadata saved successfully",
//         fileUrl,
//       });
//     } catch (error) {
//       console.error("Database Error:", error);
//       res.status(500).json({ message: "Failed to save file metadata in database" });
//     }
//   });
  
  

// // Start the Server
// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const mysql = require("mysql2/promise"); // MySQL promise-based client

// const app = express();
// app.use(express.json()); // Middleware to parse JSON

// // MySQL Database Connection
// const db = mysql.createPool({
//     host: "srv1134.hstgr.io", // Replace with your Hostinger database host
//     user: "u518897449_artistMusic", // Replace with your database username
//     password: "artistMusic1234", // Replace with your database password
//     database: "u518897449_artistMusic", // Replace with your database name
// });

// // Ensure `uploads` directory exists
// const uploadDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Multer Configuration for File Uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir); // Save files in `uploads` directory
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage });

// // Serve Uploaded Files
// app.use("/uploads", express.static(uploadDir));

// // Handle File Upload and Save Metadata
// app.post("/upload-music", upload.single("file"), async (req, res) => {
//   const file = req.file;

//   // Ensure required fields are present
//   if (!file) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }

//   const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
//   const { title = "Untitled", type = "Unknown" } = req.body; // Optional title and type

//   try {
//     // Insert metadata into ArtistMusicLibrary
//     const query = `
//       INSERT INTO ArtistMusicLibrary (title, type, file_url, created_at)
//       VALUES (?, ?, ?, NOW())
//     `;
//     await db.execute(query, [title, type, fileUrl]);

//     res.status(201).json({
//       message: "File uploaded and metadata saved successfully",
//       fileUrl,
//     });
//   } catch (error) {
//     console.error("Database Error:", error);
//     res.status(500).json({ message: "Failed to save file metadata in database" });
//   }
// });

// // Start the Server
// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql2/promise"); // MySQL client

const app = express();
app.use(express.json()); // Middleware to parse JSON

// MySQL Database Connection
const db = mysql.createPool({
    host: "srv1134.hstgr.io", // Replace with your Hostinger database host
    user: "u518897449_artistMusic", // Replace with your database username
    password: "artistMusic1234", // Replace with your database password
    database: "u518897449_artistMusic", // Replace with your database name
});

// Ensure `uploads` directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in `uploads` directory
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Serve Uploaded Files
app.use("/uploads", express.static(uploadDir));

// API: Upload Music and Save Metadata
app.post("/upload-music", upload.single("file"), async (req, res) => {
  const file = req.file;
  const { title = "Untitled", type = "Unknown" } = req.body; // Optional title and type

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

  try {
    // Insert metadata into ArtistMusicLibrary
    const query = `
      INSERT INTO ArtistMusicLibrary (title, type, file_url, created_at)
      VALUES (?, ?, ?, NOW())
    `;
    await db.execute(query, [title, type, fileUrl]);

    res.status(201).json({
      message: "File uploaded and metadata saved successfully",
      fileUrl,
    });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to save file metadata in database" });
  }
});

// API: Fetch All Music Files
app.get("/music", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM ArtistMusicLibrary");
    res.status(200).json(rows); // Send the list of music files as JSON
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to fetch music files" });
  }
});

// Start the Server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
