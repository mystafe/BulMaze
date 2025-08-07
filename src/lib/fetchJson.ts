import { toast } from 'sonner';

export async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(input, init);
    if (!res.ok) {
      let message = 'Request failed';
      try {
        const data = await res.json();
        if (data && typeof data === 'object' && 'error' in data) {
          message = (data as { error: string }).error;
        }
      } catch {
        // ignore
      }
      toast.error(message);
      throw new Error(message);
    }
    return (await res.json()) as T;
  } catch (err) {
    toast.error('Network error');
    throw err;
  }
}
