export type ReqFrame = {
  type: "req";
  id: string;
  method: string;
  params: unknown;
};

export type ResFrame = {
  type: "res";
  id: string;
  ok: boolean;
  payload?: unknown;
  error?: {
    code: string;
    message: string;
    details?: unknown;
    retryable?: boolean;
    retryAfterMs?: number;
  };
};

export type EventFrame = {
  type: "event";
  event: string;
  payload: unknown;
  seq?: number;
  stateVersion?: number;
};

export type GatewayFrame = ReqFrame | ResFrame | EventFrame;
