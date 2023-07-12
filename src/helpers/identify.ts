export function identify(input: unknown): string {
  let name = String(input);
  const type = typeof input;

  if (input !== null && input !== undefined) {
    if (typeof input === 'object') {
      name = input.constructor.name;
    }

    if (typeof input === 'function') {
      name = input.name ?? 'anonymous';
    }
  }

  return '[' + type + ' ' + name + ']';
}
