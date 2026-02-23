export interface LiveResponse {
  status: "ok";
  version: string;
}

/** Build the /api/live response payload. */
export function buildLiveResponse(version: string): LiveResponse {
  return { status: "ok", version };
}
