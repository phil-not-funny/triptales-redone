import { AxiosResponse, HttpStatusCode } from "axios";

/**
 * Runs a request and reports whether it finished with the expected status.
 * Network errors and non-2xx responses (which axios throws) count as failure.
 *
 * @param request - Performs the HTTP call.
 * @param expectedStatus - The status code that marks success.
 */
export const succeeds = async (
  request: () => Promise<AxiosResponse>,
  expectedStatus: HttpStatusCode = HttpStatusCode.Ok,
): Promise<boolean> => {
  try {
    return (await request()).status === expectedStatus;
  } catch {
    return false;
  }
};

/**
 * Runs a request and returns its body if the call returned 200 and the body
 * passes the given type guard.
 *
 * @param request - Performs the HTTP call.
 * @param guard - Runtime check for the expected response shape.
 * @returns The validated body, or `null` if the call failed or the shape is invalid.
 */
export const fetchValidated = async <T>(
  request: () => Promise<AxiosResponse<unknown>>,
  guard: (data: unknown) => data is T,
): Promise<T | null> => {
  try {
    const response = await request();
    return response.status === HttpStatusCode.Ok && guard(response.data)
      ? response.data
      : null;
  } catch {
    return null;
  }
};
