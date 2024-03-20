import type { AppRouter } from "@snuber/api/trpc";
import type { TRPCLink } from "@trpc/client";
import React from "react";
import { router } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { observable } from "@trpc/server/observable";
import superjson from "superjson";

import { getBaseAPIUrl } from "~/utils/get-base-url";
import { secureStore } from "~/utils/secure-store";

export const trpc = createTRPCReact<AppRouter>();

const errorLink: TRPCLink<AppRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      const unsubscribe = next(op).subscribe({
        next(value) {
          observer.next(value);
        },
        error(err) {
          if (err.data?.code === "UNAUTHORIZED") {
            router.push("/(non-authenticated)/signin");
          }
        },
        complete() {
          observer.complete();
        },
      });
      return unsubscribe;
    });
  };
};

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
        errorLink,
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
