/**
 * Logging utility for BMAD MCP Server
 */

import chalk from 'chalk';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private level: LogLevel;
  private context: string;

  constructor(context: string = 'BMAD-MCP', level?: LogLevel) {
    this.context = context;
    this.level = level ?? this.getLevelFromEnv();
  }

  private getLevelFromEnv(): LogLevel {
    const envLevel = process.env.BMAD_LOG_LEVEL?.toUpperCase();
    switch (envLevel) {
      case 'DEBUG':
        return LogLevel.DEBUG;
      case 'INFO':
        return LogLevel.INFO;
      case 'WARN':
        return LogLevel.WARN;
      case 'ERROR':
        return LogLevel.ERROR;
      default:
        return LogLevel.INFO;
    }
  }

  private formatMessage(level: string, message: string, meta?: unknown): string {
    const timestamp = new Date().toISOString();
    const baseMsg = `[${timestamp}] [${this.context}] ${level}: ${message}`;

    if (meta) {
      return `${baseMsg}\n${JSON.stringify(meta, null, 2)}`;
    }

    return baseMsg;
  }

  debug(message: string, meta?: unknown): void {
    if (this.level <= LogLevel.DEBUG) {
      console.log(chalk.gray(this.formatMessage('DEBUG', message, meta)));
    }
  }

  info(message: string, meta?: unknown): void {
    if (this.level <= LogLevel.INFO) {
      console.log(chalk.blue(this.formatMessage('INFO', message, meta)));
    }
  }

  warn(message: string, meta?: unknown): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(chalk.yellow(this.formatMessage('WARN', message, meta)));
    }
  }

  error(message: string, error?: Error | unknown): void {
    if (this.level <= LogLevel.ERROR) {
      if (error instanceof Error) {
        console.error(
          chalk.red(
            this.formatMessage('ERROR', message, {
              message: error.message,
              stack: error.stack,
            })
          )
        );
      } else {
        console.error(chalk.red(this.formatMessage('ERROR', message, error)));
      }
    }
  }

  success(message: string, meta?: unknown): void {
    if (this.level <= LogLevel.INFO) {
      console.log(chalk.green(this.formatMessage('SUCCESS', message, meta)));
    }
  }

  withContext(context: string): Logger {
    return new Logger(`${this.context}:${context}`, this.level);
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }
}

// Export default logger instance
export const logger = new Logger();

// Export factory for creating contextual loggers
export function createLogger(context: string): Logger {
  return logger.withContext(context);
}
