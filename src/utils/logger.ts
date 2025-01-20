type LogLevel = 'info' | 'warn' | 'error';
type LogMetadata = Record<string, unknown>;

const getTimestamp = (): string => {
  const now = new Date();
  return now.toISOString();
};

const formatMetadata = (metadata?: LogMetadata): string => {
  if (!metadata || Object.keys(metadata).length === 0) {
    return '';
  }
  try {
    return ` ${JSON.stringify(metadata, getCircularReplacer())}`;
  } catch (error) {
    return ' [Unable to stringify metadata]';
  }
};

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: string, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular Reference]';
      }
      seen.add(value);
    }
    return value;
  };
};

const log = (level: LogLevel, message: string, metadata?: LogMetadata) => {
  const timestamp = getTimestamp();
  const formattedMetadata = formatMetadata(metadata);

  console[level](`[${timestamp}] [${level.toUpperCase()}]: ${message}${formattedMetadata}`);
};

const logger = {
  info: (message: string, metadata?: LogMetadata) => log('info', message, metadata),
  warn: (message: string, metadata?: LogMetadata) => log('warn', message, metadata),
  error: (message: string, metadata?: LogMetadata) => log('error', message, metadata),
};

export default logger;