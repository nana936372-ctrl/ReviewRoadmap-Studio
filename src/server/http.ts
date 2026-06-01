export function sendJson(response: any, statusCode: number, payload: unknown) {
  if (typeof response.status === 'function' && typeof response.json === 'function') {
    response.status(statusCode).json(payload);
    return;
  }

  response.statusCode = statusCode;
  response.setHeader?.('Content-Type', 'application/json');
  response.end(JSON.stringify(payload));
}

export function queryValue(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0];
  }

  return '';
}
