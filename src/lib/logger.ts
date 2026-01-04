// src/lib/logger.ts
type Level = "info" | "error";

function time() {
  return new Date().toISOString();
}

function print(level: Level, scope: string, event: string, meta?: any) {
  const prefix = `[${time()}][FE][${level.toUpperCase()}][${scope}] ${event}`;
  if (meta !== undefined) {
    console[level === "info" ? "log" : "error"](prefix, meta);
  } else {
    console[level === "info" ? "log" : "error"](prefix);
  }
}

export const logger = {
  info: (scope: string, event: string, meta?: any) => print("info", scope, event, meta),
  error: (scope: string, event: string, meta?: any) => print("error", scope, event, meta),
};

