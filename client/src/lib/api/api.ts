const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8000/api/v1";

export const TOKEN_STORAGE_KEY = "lexmind_access_token";

export class ApiError extends Error {
  status: number;
  detail?: unknown;

  constructor(
    message: string,
    status: number,
    detail?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_STORAGE_KEY);
}

function extractErrorMessage(
  detail: unknown,
): string {
  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (
          typeof item === "object" &&
          item !== null &&
          "msg" in item
        ) {
          return String(
            (item as { msg: unknown }).msg,
          );
        }

        return null;
      })
      .filter(Boolean);

    if (messages.length > 0) {
      return messages.join(". ");
    }
  }

  if (
    typeof detail === "object" &&
    detail !== null &&
    "message" in detail
  ) {
    return String(
      (detail as { message: unknown }).message,
    );
  }

  return "Something went wrong. Please try again.";
}

function notifyUnauthorized(): void {
  window.dispatchEvent(
    new CustomEvent("lexmind:unauthorized"),
  );
}

interface RequestOptions
  extends RequestInit {
  skipAuth?: boolean;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    skipAuth = false,
    headers,
    ...fetchOptions
  } = options;

  const requestHeaders = new Headers(headers);

  if (
    fetchOptions.body &&
    !(fetchOptions.body instanceof FormData)
  ) {
    requestHeaders.set(
      "Content-Type",
      "application/json",
    );
  }

  if (!skipAuth) {
    const token = getToken();

    if (token) {
      requestHeaders.set(
        "Authorization",
        `Bearer ${token}`,
      );
    }
  }

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...fetchOptions,
      headers: requestHeaders,
    },
  );

  const contentType =
    response.headers.get("content-type") || "";

  let responseData: unknown;

  if (contentType.includes("application/json")) {
    responseData = await response.json();
  } else {
    const text = await response.text();

    responseData = text || null;
  }

  if (!response.ok) {
    const detail =
      typeof responseData === "object" &&
      responseData !== null &&
      "detail" in responseData
        ? (
            responseData as {
              detail: unknown;
            }
          ).detail
        : responseData;

    if (response.status === 401) {
      notifyUnauthorized();
    }

    throw new ApiError(
      extractErrorMessage(detail),
      response.status,
      detail,
    );
  }

  return responseData as T;
}

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}
