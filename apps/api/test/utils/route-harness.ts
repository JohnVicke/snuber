import type { UnstableDevWorker } from "wrangler";
import { onTestFinished } from "vitest";
import { unstable_dev } from "wrangler";

import { Harness } from "./harness";

export class RouteHarness extends Harness {
  private worker: UnstableDevWorker;

  private constructor(worker: UnstableDevWorker) {
    super();
    this.worker = worker;
    onTestFinished(this.worker.stop);
  }

  static async init() {
    const worker = await unstable_dev("src/worker.ts", {
      local: true,
      logLevel: "warn",
      experimental: { disableExperimentalWarning: true },
      vars: {
        DATABASE_URL: "file:test.sqlite",
        DATABASE_AUTH_TOKEN: "test",
      },
    });
    const h = new RouteHarness(worker);
    return h;
  }

  public async do<TBody = unknown, TResponse = unknown>(
    req: StepRequest<TBody>,
  ): Promise<StepResponse<TResponse>> {
    const res = await this.worker.fetch(req.url, {
      method: req.method,
      headers: req.headers,
      body: JSON.stringify(req.body),
    });
    return {
      status: res.status,
      headers: headersToRecord(res.headers as unknown as Headers),
      body: (await res.json().catch(() => {
        console.error(`${req.url} did not return json`);
        return {};
      })) as TResponse,
    };
  }

  async get<TResponse>(req: Omit<StepRequest<never>, "method">) {
    return this.do<never, TResponse>({ method: "GET", ...req });
  }
}

function headersToRecord(headers: Headers): Record<string, string> {
  return Array.from(headers).reduce(
    (record, [key, value]) => {
      record[key] = value;
      return record;
    },
    {} as Record<string, string>,
  );
}

interface StepResponse<TBody> {
  status: number;
  headers: Record<string, string>;
  body: TBody;
}

interface StepRequest<TBody> {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: TBody;
}
