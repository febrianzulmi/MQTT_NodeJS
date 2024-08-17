// Mengimpor modul yang diperlukan
const express = require("express");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");

// Membuat instance aplikasi Express dan server HTTP
const app = express();
const server = http.createServer(app);

// Mengimpor file mqtt.js dan mysql.js
const mqttClient = require("./mqtt");
const { db } = require("./mysql");

// Menghubungkan Socket.IO ke server
const io = socketIo(server);

// Middleware untuk parsing JSON dan melayani file statis
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Rute untuk mengirimkan file HTML utama
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// API endpoint untuk mendapatkan semua data dari database
app.get("/api", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM dumbvalue ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Menangani koneksi baru dengan Socket.IO
io.on("connection", (socket) => {
  console.log("New client connected");

  // Emit a welcome message
  socket.emit("message", "Welcome to the Socket.IO server!");

  // Emit all data from the database on new connection
  db.execute("SELECT * FROM dumbvalue ORDER BY id DESC")
    .then(([rows]) => {
      socket.emit("alldata", JSON.stringify(rows));
    })
    .catch((err) => console.error("Database error:", err));

  // Menangani disconnect event
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Menangani pesan yang diterima dari MQTT
mqttClient.on("message", async (topic, message) => {
  if (topic === "sensor/data") {
    const newSensorData = message.toString();
    io.emit(
      "sensorData",
      JSON.stringify({
        val: newSensorData,
        timestamp: new Date().toISOString(),
      })
    ); // Mengirim data sensor terbaru ke semua klien
    console.log("Received:", newSensorData);

    // Simpan data ke database
    try {
      await db.execute("INSERT INTO dumbvalue (val) VALUES (?)", [
        newSensorData,
      ]);

      // Emit updated data to all connected clients
      const [rows] = await db.execute(
        "SELECT * FROM dumbvalue ORDER BY id DESC"
      );
      io.emit("alldata", JSON.stringify(rows));

      console.log("Data saved to database and emitted to clients");
    } catch (err) {
      console.error("Database error:", err);
    }
  }
});

// Menjalankan server pada port yang ditentukan
const PORT = 3002;
server.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
