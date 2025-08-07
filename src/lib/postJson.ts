import { toast } from 'sonner';

interface PostJsonOptions extends Omit<RequestInit, 'body'> {
  timeout?: number;
}

export async function postJSON<T>(
  url: string,
  body?: unknown,
  { timeout = 10000, headers, method = 'POST', ...init }: PostJsonOptions = {},
): Promise<T> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        ...init,
      });
      if (!res.ok) {
        if (attempt === 0) continue;
        let message = 'Request failed';
        if (res.status === 422) {
          message = 'content generation failed, please retry';
        } else {
          try {
            const data = await res.json();
            if (data && typeof data === 'object' && 'error' in data) {
              message = (data as { error: string }).error;
            }
          } catch {
            // ignore
          }
        }
        toast.error(message);
        throw new Error(message);
      }
      return (await res.json()) as T;
    } catch (err) {
      if (attempt === 1) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          toast.error('Request timed out');
        } else {
          toast.error('Network error');
        }
        throw err;
      }
    } finally {
      clearTimeout(timer);
    }
  }
  // should not reach here
  throw new Error('Request failed');
}

