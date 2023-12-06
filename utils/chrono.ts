export function chrono<T>(
  fn: (arg0: T) => void,
  arg: T,
  message?: string
): void {
  const start = Date.now();
  fn(arg);
  const duration = Date.now() - start;

  const prefix = message ? `[${message}]` : '';
  console.log(`${prefix} Execution time: ${duration}ms`);
}
