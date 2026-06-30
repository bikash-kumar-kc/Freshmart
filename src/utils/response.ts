export function manageError(error: unknown) {
  if (error instanceof Error) {
    console.log(error.message);
    return error.message;
  } else {
    return;
  }
}

export function manageApiResponse<K extends string, T>(
  key: K,
  data: T[],
): Record<K, T[]> & { total: number } {
  return {
    [key]: data,
    total: data.length,
  } as Record<K, T[]> & { total: number };
}
