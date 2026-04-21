let lastAt = 0;

export function navLockRun(fn: () => void, cooldownMs: number = 600) {
  const now = Date.now();
  if (now - lastAt < cooldownMs) return;
  lastAt = now;
  fn();
}

