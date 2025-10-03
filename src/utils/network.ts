import { HOST } from "@config/constants"

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

export interface RequestOptions {
  url: string
  method?: HttpMethod
  body?: any
  headers?: Record<string, string>
  [key: string]: any
}

class Network {
  static defaultHeaders: Record<string, string> = {}

  static async request<T = any>(options: RequestOptions): Promise<T> {
    const {
      url,
      method = "GET",
      body,
      headers,
      skipStringify,
      ...rest
    } = options
    const mergedHeaders = {
      ...Network.defaultHeaders,
      ...(headers || {}),
    }
    try {
      const response = await fetch(url, {
        method,
        headers: mergedHeaders,
        body:
          method === "GET" || method === "DELETE"
            ? undefined
            : skipStringify
            ? body
            : JSON.stringify(body),
        ...rest,
      })
      // Intercept Set-Cookie or cookie header and set document.cookie if present (for non-HttpOnly cookies)
      const token = response.headers.get("x-access-token")
      if (token) {
        // Set cookie with name x-access-token, value from header, path=/, and SameSite=Lax
        document.cookie = `x-access-token=${token}; path=/; SameSite=Lax`
      }
      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ message: response.statusText }))
        throw new Error(error.message || "API error")
      }
      return response.json()
    } catch (err: any) {
      throw new Error(err.message || "Network error")
    }
  }

  static async upload(
    url: string,
    file: File,
    queryParams?: object,
    options?: RequestOptions,
  ) {
    let urlString = Network.stringifyUrl(url, queryParams)
    const environment = process.env.NODE_ENV || "development"
    const host = urlString.startsWith("http")
      ? ""
      : HOST[environment as keyof object]
    urlString = host ? host + urlString : urlString
    const formData = new FormData()
    formData.append("files", file)
    options = {
      url: urlString,
      method: "POST",
      mode: "cors",
      body: formData,
      credentials: "include",
      skipStringify: true,
      ...options,
    }
    return Network.request(options)
  }

  static get<T = any>(
    url: string,
    options: Omit<RequestOptions, "url" | "method" | "body"> = {},
  ) {
    options.headers = {
      "Content-Type": "application/json",
      credentials: "include",
      ...(options.headers || {}),
    }
    return Network.request<T>({ url, method: "GET", ...options })
  }

  static post<T = any>(
    url: string,
    body?: any,
    options: Omit<RequestOptions, "url" | "method" | "body"> = {},
  ) {
    options.headers = {
      "Content-Type": "application/json",
      credentials: "include",
      ...(options.headers || {}),
    }
    return Network.request<T>({ url, method: "POST", body, ...options })
  }

  static put<T = any>(
    url: string,
    body?: any,
    options: Omit<RequestOptions, "url" | "method" | "body"> = {},
  ) {
    options.headers = {
      "Content-Type": "application/json",
      credentials: "include",
      ...(options.headers || {}),
    }
    return Network.request<T>({ url, method: "PUT", body, ...options })
  }

  static delete<T = any>(
    url: string,
    options: Omit<RequestOptions, "url" | "method" | "body"> = {},
  ) {
    options.headers = {
      "Content-Type": "application/json",
      credentials: "include",
      ...(options.headers || {}),
    }
    return Network.request<T>({ url, method: "DELETE", ...options })
  }

  static stringifyUrl(url: string, queryParams?: any) {
    if (!queryParams) {
      return url || ""
    }
    const arrLength = Object.keys(queryParams).length
    return url && arrLength
      ? Object.keys(queryParams)
          .filter((k) => queryParams[k] !== undefined)
          .reduce(
            (acc, key, index) =>
              acc.concat(
                `${encodeURIComponent(key)}=${encodeURIComponent(
                  queryParams[key],
                ).replace(/'/g, "%27")}` + (index < arrLength - 1 ? "&" : ""),
              ),
            url + "?",
          )
      : ""
  }
}

export default Network
