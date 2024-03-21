import { createServer } from "http";
import type { Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import { Server } from "socket.io";

import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types";

export function createIOServer() {
  const httpServer = createServer();

  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    cors: {
      origin: "exp://192.168.1.89:8081",
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  const pubClient = new Redis(process.env.REDIS_URL!);

  const subClient = pubClient.duplicate();

  io.adapter(createAdapter(pubClient, subClient));
  return io;
}

export type SnuberServer = ReturnType<typeof createIOServer>;
export type SnuberSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
