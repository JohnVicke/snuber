import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@snuber/socket.io-server/types";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

import { getBaseIP } from "~/utils/get-base-url";

const URL = `http://${getBaseIP()}:42069`;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
  io(URL);
