import { createContext, useContext, ReactNode } from 'react';
import { MoodData } from '@/types/mood';
import { SyncStatus } from '@/services/sync-service';
import { useMoodEntries } from '@/hooks/useMoodEntries';

interface SyncContextValue {
  entries: MoodData[];
  isLoading: boolean;
  syncStatus: SyncStatus;
  pendingCount: number;
  isOnline: boolean;
  addEntry: (entry: MoodData) => Promise<boolean>;
  deleteEntry: (entryDate: string) => Promise<boolean>;
  rollback: () => void;
  exportCSV: (entry?: MoodData) => void;
  importCSV: (file: File) => Promise<number>;
  forceSync: () => Promise<boolean>;
  createEmptyMoodData: () => MoodData;
}

const SyncContext = createContext<SyncContextValue | null>(null);

export function SyncProvider({ children }: { children: ReactNode }) {
  const moodEntries = useMoodEntries();

  return (
    <SyncContext.Provider value={moodEntries}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSyncContext(): SyncContextValue {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSyncContext must be used within a SyncProvider');
  }
  return context;
}
