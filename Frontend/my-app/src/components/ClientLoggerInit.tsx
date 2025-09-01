'use client';

import { useEffect } from 'react';

export default function ClientLoggerInit() {
  useEffect(() => {
    const env = (process.env.NEXT_PUBLIC_ENV || 'dev').toLowerCase();

    const original = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
      debug: console.debug,
    } as const;

    const format = (level: string, args: unknown[]) => {
      const ts = new Date().toISOString();
      const msg = args
        .map((a) => (typeof a === 'string' ? a : (() => { try { return JSON.stringify(a); } catch { return String(a); } })()))
        .join(' ');
      return `${ts} [${level}] ${msg}`;
    };

    type ConsoleFunc = (message?: unknown, ...optionalParams: unknown[]) => void;
    const bind = (method: keyof typeof original, level: string) =>
      (...args: unknown[]) => {
        const callOriginal = original[method] as unknown as ConsoleFunc;
        callOriginal(format(level, args));
      };

    // Always available
    console.info = bind('info', 'info');
    console.warn = bind('warn', 'warn');
    console.error = bind('error', 'error');

    if (env === 'production') {
      // Route log/debug to info to align with info-level in prod
      console.log = bind('info', 'info');
      console.debug = () => {};
    } else {
      console.log = bind('log', 'debug');
      console.debug = bind('debug', 'debug');
    }

    return () => {
      console.log = original.log;
      console.info = original.info;
      console.warn = original.warn;
      console.error = original.error;
      console.debug = original.debug;
    };
  }, []);

  return null;
}


