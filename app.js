import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "https://frontend-estate-app.onrender.com",
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true
  }
});

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("newUser", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log("User", userId, "connected");
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiverSocketId = onlineUsers[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("getMessage", data);
    } else {
      console.log("Receiver not found:", receiverId);
    }
  });

  socket.on("disconnect", () => {
    const userId = Object.keys(onlineUsers).find(
      (key) => onlineUsers[key] === socket.id
    );
    if (userId) {
      delete onlineUsers[userId];
      console.log("User", userId, "disconnected");
    }
  });
});

const PORT = process.env.PORT || 4000;
io.listen(PORT, () => {
  console.log(`Socket.io server listening on port ${PORT}`);
});
