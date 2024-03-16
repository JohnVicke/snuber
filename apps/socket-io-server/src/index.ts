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

const pubClient = new Redis(process.env.REDIS_URL!);

const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));

io.on("connection", (socket) => {
  console.log("a user connected");
});

io.listen(42069);
