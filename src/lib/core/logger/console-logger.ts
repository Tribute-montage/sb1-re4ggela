import { Logger, LogLevel } from './types';

class ConsoleLogger implements Logger {
  private log(level: LogLevel, message: string, data?: unknown): void {
    if (import.meta.env.DEV) {
      const timestamp = new Date().toISOString();
      console[level](`[${timestamp}] [${level.toUpperCase()}] ${message}`, data);
    }
  }

  debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: unknown): void {
    this.log('error', message, data);
  }
}