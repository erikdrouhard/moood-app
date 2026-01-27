import { MoodData } from '@/types/mood';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
};

function calculateBackoff(attempt: number, config: RetryConfig): number {
  const delay = Math.min(
    config.baseDelayMs * Math.pow(2, attempt),
    config.maxDelayMs
  );
  // Add jitter to prevent thundering herd
  return delay + Math.random() * 1000;
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof TypeError) {
    // Network errors
    return true;
  }
  if (error instanceof Response) {
    // Retry on 5xx errors, not on 4xx
    return error.status >= 500;
  }
  return false;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry<T>(
  url: string,
  options: RequestInit,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        if (response.status >= 500 && attempt < config.maxRetries) {
          throw response; // Will be caught and retried
        }
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.error || `HTTP ${response.status}`,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      lastError = error;

      if (attempt < config.maxRetries && isRetryableError(error)) {
        const delay = calculateBackoff(attempt, config);
        console.log(`Retry attempt ${attempt + 1} after ${Math.round(delay)}ms`);
        await sleep(delay);
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = {
  async getEntries(): Promise<MoodData[]> {
    return fetchWithRetry<MoodData[]>(`${API_BASE}/entries`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  async createEntry(entry: MoodData): Promise<{ id: number }> {
    return fetchWithRetry<{ id: number }>(`${API_BASE}/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    });
  },

  async deleteEntry(date: string): Promise<{ deleted: number }> {
    return fetchWithRetry<{ deleted: number }>(`${API_BASE}/entries`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date }),
    });
  },
};
