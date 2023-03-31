const express = require("express");
const app = express();
const cors = require("cors");
// socket.io recommended to use http
const http = require("http");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend url
    methods: ["GET", "POST "],
  },
});

io.on("connection", (socket) => {
  console.log(`user connected ${socket.id}`);
  
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("leave_room", (data) => {
    socket.leave(data);
    console.log(`Leave room ${data}`);
  });
});

server.listen(3001, () => {
  console.log("server is running on port 3001");
});
