import { createServer } from "http";
import type Redis from "ioredis";
import type { Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { Server } from "socket.io";

import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types";

interface ServerOptions {
  redisInstance: Redis;
}

export function createIOServer(opts: ServerOptions) {
  const httpServer = createServer();

  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    cors: {
      origin: ["exp://192.168.1.89:8081", "http://localhost:5173"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  io.adapter(createAdapter(opts.redisInstance, opts.redisInstance.duplicate()));
  return io;
}

export type SnuberServer = ReturnType<typeof createIOServer>;
export type SnuberSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
