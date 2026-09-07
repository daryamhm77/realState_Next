export async function readApiError(response: Response) {
  const body: unknown = await response.json().catch(() => null);

  if (
    body &&
    typeof body === "object" &&
    "message" in body &&
    typeof body.message === "string"
  ) {
    return body.message;
  }

  return "Request failed";
}

export async function parseApiData<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  const body: unknown = await response.json();

  if (!body || typeof body !== "object" || !("data" in body)) {
    throw new Error("Invalid response");
  }

  return body.data as T;
}
