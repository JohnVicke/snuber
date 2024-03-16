import type { paths } from "./openapi";

type Path = keyof paths;

type PathsForMethod<TMethod extends keyof paths[keyof paths]> = {
  [TPath in Path]: paths[TPath][TMethod] extends undefined
    ? never
    : paths[TPath][TMethod];
};

type GetPaths = PathsForMethod<"get">;

type Result<TResult, TError> =
  | { result: TResult; error?: never }
  | { result?: never; error: TError };

type ErrorResponse<T> = {
  [K in keyof T]: K extends 201 | 200 ? never : T[K];
};

export class SnuberApi {
  async get(
    path: keyof GetPaths,
  ): Promise<
    Result<GetPaths[typeof path], ErrorResponse<GetPaths[typeof path]>>
  > {
    const res = await fetch(path);

    if (res?.ok) {
      return {
        result: (await res.json()) as GetPaths[typeof path],
      };
    }

    return {
      error: (await res.json()) as ErrorResponse<GetPaths[typeof path]>,
    };
  }
}
