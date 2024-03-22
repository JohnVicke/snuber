import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@snuber/socket.io-server/types";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

const URL = `http://localhost:42069`;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
  io(URL);
