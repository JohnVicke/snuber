import type { SnuberSocket } from "./server";

export function registerClientEvents(socket: SnuberSocket) {
  socket.on("hello", (w) => {
    console.log(w);
  });
  socket.on("emergency", (s) => {
    console.log(s);
  });
}
