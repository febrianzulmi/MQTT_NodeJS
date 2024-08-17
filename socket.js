// tes-socket.js
// const http = require("http");
const socketIo = require("socket.io");

// const server = http.createServer();
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("New client connected");

  // Emit a test message
  socket.emit("message", "Welcome to the Socket.IO server!");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// const PORT = 3003;
// serverIO.listen(PORT, () => {
//   console.log(`Socket.io server running on port ${PORT}`);
// });

module.exports = { io, server };
