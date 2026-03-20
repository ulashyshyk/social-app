// apps/backend/src/config/socket.ts
import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './env';
import type { UserPayload } from '../../../../packages/shared-types/src/user.types';

let io: SocketIOServer | null = null;

export const initSocket = (httpServer: HTTPServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('Socket connected:', socket.id);

    // 1) Client'tan auth token bekle (connected olduktan hemen sonra)
    socket.on('auth', (token: string) => {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;

        // 2) Kullanıcıyı kendi userId room'una join et
        const userRoom = decoded.userId;
        socket.join(userRoom);

        // İstersen socket.data.userId = decoded.userId olarak saklayabilirsin
        (socket.data as any).userId = decoded.userId;

        console.log(`Socket ${socket.id} joined room ${userRoom}`);
      } catch (err) {
        console.error('Socket auth error:', err);
        socket.disconnect();
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });

  console.log('Socket.IO initialized');
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};
