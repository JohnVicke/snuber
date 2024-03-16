import { createServer } from "http";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import { Server } from "socket.io";

import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types";

const httpServer = createServer();

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

const pubClient = new Redis(
  "rediss://default:9cac102a5e704889bc553077aba3c281@native-chow-39725.upstash.io:39725",
);

const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));

io.on("connection", (socket) => {
  console.log("a user connected");
});

io.listen(42069);
