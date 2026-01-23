"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ConnectionPanel } from "../../src/components/ConnectionPanel";
import { GatewayResponseError } from "../../src/lib/gateway/GatewayClient";
import type { EventFrame } from "../../src/lib/gateway/frames";
import { useGatewayConnection } from "../../src/lib/gateway/useGatewayConnection";

const prettyPrint = (value: unknown) => JSON.stringify(value, null, 2);

const formatCallError = (error: unknown) => {
  if (error instanceof GatewayResponseError) {
    return `Gateway error (${error.code}): ${error.message}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error.";
};

export default function ProtocolExplorerPage() {
  const {
    client,
    status,
    gatewayUrl,
    token,
    error,
    connect,
    disconnect,
    setGatewayUrl,
    setToken,
  } = useGatewayConnection();

  const [method, setMethod] = useState("health");
  const [paramsText, setParamsText] = useState("{}");
  const [responseText, setResponseText] = useState<string | null>(null);
  const [callError, setCallError] = useState<string | null>(null);
  const [events, setEvents] = useState<EventFrame[]>([]);
  const [isCalling, setIsCalling] = useState(false);

  useEffect(() => {
    return client.onEvent((event) => {
      setEvents((prev) => [event, ...prev].slice(0, 50));
    });
  }, [client]);

  const runCall = useCallback(async () => {
    setCallError(null);
    setResponseText(null);

    const trimmedMethod = method.trim();
    if (!trimmedMethod) {
      setCallError("Method name is required.");
      return;
    }

    let parsedParams: unknown = {};
    if (paramsText.trim()) {
      try {
        parsedParams = JSON.parse(paramsText);
      } catch {
        setCallError("Params must be valid JSON.");
        return;
      }
    }

    setIsCalling(true);
    try {
      const payload = await client.call(trimmedMethod, parsedParams);
      setResponseText(prettyPrint(payload));
    } catch (err) {
      setCallError(formatCallError(err));
    } finally {
      setIsCalling(false);
    }
  }, [client, method, paramsText]);

  const loadExample = useCallback((nextMethod: string, params: unknown) => {
    setMethod(nextMethod);
    setParamsText(prettyPrint(params));
  }, []);

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="glass-panel fade-up px-6 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Clawdbot
              </span>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Protocol Explorer
              </h1>
              <p className="text-sm text-slate-600">
                Inspect Gateway methods, responses, and live events.
              </p>
            </div>
            <Link
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
              href="/"
            >
              Back to Canvas
            </Link>
          </div>
          <div className="mt-6">
            <ConnectionPanel
              gatewayUrl={gatewayUrl}
              token={token}
              status={status}
              error={error}
              onGatewayUrlChange={setGatewayUrl}
              onTokenChange={setToken}
              onConnect={connect}
              onDisconnect={disconnect}
            />
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="glass-panel fade-up-delay flex flex-col gap-4 px-6 py-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Method
              </label>
              <input
                className="h-11 rounded-full border border-slate-300 bg-white/80 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                type="text"
                value={method}
                onChange={(event) => setMethod(event.target.value)}
                placeholder="health"
                spellCheck={false}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Params (JSON)
              </label>
              <textarea
                className="min-h-[140px] rounded-2xl border border-slate-300 bg-white/80 p-3 font-mono text-xs text-slate-900 outline-none transition focus:border-slate-500"
                value={paramsText}
                onChange={(event) => setParamsText(event.target.value)}
                spellCheck={false}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-70"
                type="button"
                onClick={runCall}
                disabled={status !== "connected" || isCalling}
              >
                {isCalling ? "Calling..." : "Send"}
              </button>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Quick fill
                <button
                  className="rounded-full border border-slate-300 px-3 py-1 text-[11px] font-semibold text-slate-700 transition hover:border-slate-400"
                  type="button"
                  onClick={() => loadExample("health", {})}
                >
                  health
                </button>
                <button
                  className="rounded-full border border-slate-300 px-3 py-1 text-[11px] font-semibold text-slate-700 transition hover:border-slate-400"
                  type="button"
                  onClick={() => loadExample("sessions.list", {})}
                >
                  sessions.list
                </button>
              </div>
            </div>
            {callError ? (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
                {callError}
              </p>
            ) : null}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Last Response
              </label>
              <pre className="min-h-[140px] whitespace-pre-wrap rounded-2xl border border-slate-200 bg-white/70 p-3 text-xs text-slate-700">
                {responseText ?? "No response yet."}
              </pre>
            </div>
          </section>

          <section className="glass-panel fade-up-delay flex flex-col gap-4 px-6 py-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Event Log</h2>
              <button
                className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-400"
                type="button"
                onClick={() => setEvents([])}
              >
                Clear
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {events.length === 0 ? (
                <p className="text-sm text-slate-600">
                  Events will appear here once the Gateway starts streaming.
                </p>
              ) : (
                events.map((event, index) => (
                  <div
                    key={`${event.event}-${event.seq ?? index}-${index}`}
                    className="rounded-2xl border border-slate-200 bg-white/70 p-3"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {event.event}
                    </p>
                    <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap text-xs text-slate-700">
                      {prettyPrint(event.payload)}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
