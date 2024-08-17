const mysql = require("mysql2");

// Konfigurasi koneksi ke database MySQL
const db = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "dumpdata",
    port: 3316,
  })
  .promise();

console.log("Database connection established");

// Fungsi untuk menguji koneksi dan query database
// async function testDatabase() {
//   try {
//     // Mengambil waktu saat ini dari database
//     const [now] = await db.query("SELECT NOW() AS now");
//     console.log("Current time from database:", now[0].now);

//     // Mengambil data terbaru dari tabel sensor_data
//     const [rows] = await db.query(
//       "SELECT * FROM dumbvalue ORDER BY timestamp DESC LIMIT 10"
//     );
//     console.log("Recent sensor data:", rows);
//   } catch (err) {
//     console.error("Database error:", err);
//   }
// }

// // Menjalankan fungsi untuk menguji database
// testDatabase();

// Mengekspor `db` dan `testDatabase`
module.exports = {
  db,
  //   testDatabase,
};
