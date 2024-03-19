import type { AppRouter } from "@snuber/api/trpc";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";

import { getBaseAPIUrl } from "~/utils/get-base-url";
import { secureStore } from "~/utils/secure-store";

export const trpc = createTRPCReact<AppRouter>();

export function TRPCProvider(props: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());
  const [trpcClient] = React.useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
          colorMode: "ansi",
        }),
        httpBatchLink({
          transformer: superjson,
          url: `${getBaseAPIUrl()}/trpc`,
          async headers() {
            const headers = new Map<string, string>();
            const token = await secureStore().get("session_token");
            headers.set("x-trpc-source", "expo-react");
            if (token) {
              headers.set("Authorization", `Bearer ${token}`);
            }
            return Object.fromEntries(headers);
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
