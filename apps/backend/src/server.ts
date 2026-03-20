import express from "express";
import http from "http";
import cors from "cors";

import { env } from "./config/env";
import { connectDB } from "./config/db";
import { corsOptions } from "./config/cors";
import { initSocket } from "./config/socket";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import topicRoutes from "./routes/topic.routes";
import commentRoutes from "./routes/comment.routes";
import searchRoutes from "./routes/search.routes";
import friendRequestRoutes  from "./routes/friendRequest.routes";
import notificationRoutes from "./routes/notification.routes";

async function startServer() {
  try {
    await connectDB();

    const app = express();

    // Middlewares
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Routes
    app.use("/auth", authRoutes);
    app.use("/users", userRoutes);
    app.use("/topics", topicRoutes);
    app.use("/comments", commentRoutes);
    app.use("/search", searchRoutes);
    app.use("/friend-requests", friendRequestRoutes);
    app.use("/notifications", notificationRoutes);
     
    // HTTP server
    const server = http.createServer(app);

    // Socket.IO
    initSocket(server);

    // Listen
    server.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
}

startServer();
