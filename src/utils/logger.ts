type LogLevel = 'info' | 'warn' | 'error';

const getTimestamp = (): string => {
  const now = new Date();
  return now.toISOString(); // Formato ISO 8601
};

const log = (level: LogLevel, message: string, error?: any) => {
  const timestamp = getTimestamp();
  if (error) {
    console[level](`[${timestamp}] [${level.toUpperCase()}]: ${message}`, error);
  } else {
    console[level](`[${timestamp}] [${level.toUpperCase()}]: ${message}`);
  }
};

const logger = {
  info: (message: string) => log('info', message),
  warn: (message: string) => log('warn', message),
  error: (message: string, error?: any) => log('error', message, error),
};

export default logger;
