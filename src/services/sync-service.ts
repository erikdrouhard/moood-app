import { MoodData } from '@/types/mood';
import { apiClient } from './api-client';

export type SyncAction = 'CREATE' | 'UPDATE' | 'DELETE';

export interface QueueItem {
  id: string;
  action: SyncAction;
  data: MoodData | { date: string };
  timestamp: number;
  retryCount: number;
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

const QUEUE_STORAGE_KEY = 'moodSyncQueue';
const ENTRIES_STORAGE_KEY = 'moodHistory';
const MAX_RETRIES = 3;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

class SyncService {
  private queue: QueueItem[] = [];
  private isSyncing = false;
  private listeners: Set<(status: SyncStatus, pendingCount: number) => void> = new Set();

  constructor() {
    this.loadQueue();
  }

  private loadQueue(): void {
    try {
      const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
      this.queue = stored ? JSON.parse(stored) : [];
    } catch {
      this.queue = [];
    }
  }

  private saveQueue(): void {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save sync queue:', error);
    }
  }

  private notifyListeners(status: SyncStatus): void {
    this.listeners.forEach(listener => listener(status, this.queue.length));
  }

  subscribe(listener: (status: SyncStatus, pendingCount: number) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getPendingCount(): number {
    return this.queue.length;
  }

  enqueue(action: SyncAction, data: MoodData | { date: string }): void {
    const item: QueueItem = {
      id: generateId(),
      action,
      data,
      timestamp: Date.now(),
      retryCount: 0,
    };

    // For UPDATE/DELETE, remove any pending CREATE/UPDATE for the same date
    if (action === 'UPDATE' || action === 'DELETE') {
      const date = 'date' in data ? data.date : '';
      this.queue = this.queue.filter(item => {
        const itemDate = 'date' in item.data ? item.data.date : '';
        return itemDate !== date;
      });
    }

    this.queue.push(item);
    this.saveQueue();
    this.notifyListeners('syncing');
  }

  async processQueue(isOnline: boolean): Promise<boolean> {
    if (!isOnline) {
      this.notifyListeners('offline');
      return false;
    }

    if (this.isSyncing || this.queue.length === 0) {
      if (this.queue.length === 0) {
        this.notifyListeners('synced');
      }
      return this.queue.length === 0;
    }

    this.isSyncing = true;
    this.notifyListeners('syncing');

    const failedItems: QueueItem[] = [];

    for (const item of [...this.queue]) {
      try {
        await this.processItem(item);
        // Remove from queue on success
        this.queue = this.queue.filter(q => q.id !== item.id);
        this.saveQueue();
      } catch (error) {
        console.error('Sync failed for item:', item, error);
        item.retryCount++;

        if (item.retryCount < MAX_RETRIES) {
          failedItems.push(item);
        } else {
          console.error('Max retries exceeded, dropping item:', item);
        }
      }
    }

    this.queue = failedItems;
    this.saveQueue();
    this.isSyncing = false;

    if (failedItems.length > 0) {
      this.notifyListeners('error');
      return false;
    }

    this.notifyListeners('synced');
    return true;
  }

  private async processItem(item: QueueItem): Promise<void> {
    switch (item.action) {
      case 'CREATE':
      case 'UPDATE':
        await apiClient.createEntry(item.data as MoodData);
        break;
      case 'DELETE':
        await apiClient.deleteEntry((item.data as { date: string }).date);
        break;
    }
  }

  // Local storage management for entries
  getLocalEntries(): MoodData[] {
    try {
      const stored = localStorage.getItem(ENTRIES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveLocalEntries(entries: MoodData[]): void {
    try {
      localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to save entries to localStorage:', error);
    }
  }

  clearQueue(): void {
    this.queue = [];
    this.saveQueue();
    this.notifyListeners('idle');
  }
}

// Singleton instance
export const syncService = new SyncService();
