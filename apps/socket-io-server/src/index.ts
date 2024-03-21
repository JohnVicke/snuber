import { registerClientEvents } from "./client-events";
import { createIOServer } from "./server";

const io = createIOServer();

io.on("connection", (socket) => {
  registerClientEvents(socket);
});

io.listen(42069);
