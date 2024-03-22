import Redis from "ioredis";

import { registerClientEvents } from "./client-events";
import { createIOServer } from "./server";

const redisInstance = new Redis(process.env.REDIS_URL!);
const subClient = redisInstance.duplicate();

const io = createIOServer({ redisInstance });

await subClient.subscribe("emergency");

io.on("connection", (socket) => {
  console.log("user connected");
  registerClientEvents(socket);
});

io.listen(42069);

subClient.on("message", (channel, message) => {
  console.log(`Received message from channel ${channel}: ${message}`);
  io.emit("noArg");
});
