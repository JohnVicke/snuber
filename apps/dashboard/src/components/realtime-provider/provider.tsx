import React from "react";

import { socket } from "./socket";

interface RealtimeContextValue {
  socket: typeof socket;
  isConnected: boolean;
}

const RealtimeContext = React.createContext<RealtimeContextValue>({
  socket: socket,
  isConnected: socket.connected,
});

export function RealtimeProvider(
  props: React.PropsWithChildren<{ token: string }>,
) {
  const [isConnected, setIsConnected] = React.useState(socket.connected);

  React.useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      socket.emit("hello", "world");
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("basicEmit", (data) => {
      console.info("basicEmit", data);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <RealtimeContext.Provider value={{ isConnected, socket }}>
      {props.children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const value = React.useContext(RealtimeContext);

  if (!value) {
    throw new Error("useRealtime must be used within a RealtimeProvider");
  }

  return value;
}
