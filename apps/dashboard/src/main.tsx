import React from "react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

import "./styles.css";

import { RealtimeProvider } from "./components/realtime-provider/provider";
import { ThemeProvider } from "./components/theme-provider";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RealtimeProvider token="token">
          <RouterProvider router={router} />
        </RealtimeProvider>
      </ThemeProvider>
    </React.StrictMode>,
  );
}
