import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import { env } from "./env";

let io: Server;

export function initSocket(server: HTTPServer) {
  io = new Server(server, {
    cors: {
      origin: [env.WEB_URL, env.MOBILE_URL].filter(Boolean),
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // Join personal room (userId)
    socket.on("join", (userId: string) => {
      socket.join(userId);
      console.log(`👤 User ${userId} joined their room`);
    });

    // Private message
    socket.on("private_message", (data) => {
      const { toUserId, message } = data;

      io.to(toUserId).emit("private_message", {
        message,
        from: socket.id,
      });
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  console.log("Socket.IO initialized");
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}
