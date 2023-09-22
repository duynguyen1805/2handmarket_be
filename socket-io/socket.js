function initSocket(io) {
  io.on("connection", (socket) => {
    console.log("A user connected");

    // nhận id_room từ client gửi lên
    // tạo room giữa 2 người
    socket.on("id_room", (id_room) => {
      socket.join(id_room);
      console.log(id_room);
    });
    // Người dùng rời khỏi phòng
    socket.on("leave_room", (id_room) => {
      socket.leave(id_room);
      // console.log(id_room);
    });
    // Nhận tin nhắn từ người dùng và gửi đến phòng chung id_room
    socket.on("chat_message", (data) => {
      io.to(data.id_room).emit("chat_message", data.message);
      // console.log(id_room);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
}

module.exports = { initSocket };
