import { useState, useEffect, useCallback, useRef } from 'react';
import { MoodData } from '@/types/mood';
import { apiClient } from '@/services/api-client';
import { syncService, SyncStatus } from '@/services/sync-service';
import { useOnlineStatus } from './useOnlineStatus';
import { toast } from 'sonner';
import { format } from 'date-fns';

const CSV_HEADERS = [
  'Date', 'Mood', 'Mixed State', 'Sleep Hours', 'Uninterrupted Sleep',
  'Medications Taken', 'Medication Names', 'Therapy', 'Support Group',
  'Meals', 'Snacks', 'Exercise', 'Exercise Type', 'Physical Symptoms',
  'Substance Use', 'Notes'
];

function createEmptyMoodData(): MoodData {
  return {
    date: new Date().toISOString(),
    mood: 0,
    mixedState: false,
    sleep: '',
    uninterruptedSleep: false,
    medication: { taken: false, names: '', notes: '' },
    therapy: { attended: false, notes: '' },
    supportGroup: { attended: false, notes: '' },
    meals: { count: null, snacks: null, notes: '' },
    exercise: { done: false, type: '', duration: '', notes: '' },
    relaxation: { done: false, duration: '', notes: '' },
    physicalHealth: { symptoms: '', notes: '' },
    substanceUse: { alcohol: false, drugs: false, notes: '' },
    generalNotes: '',
  };
}

export function useMoodEntries() {
  const [entries, setEntries] = useState<MoodData[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { isOnline } = useOnlineStatus();
  const previousEntriesRef = useRef<MoodData[]>([]);

  // Subscribe to sync service updates
  useEffect(() => {
    const unsubscribe = syncService.subscribe((status, count) => {
      setSyncStatus(status);
      setPendingCount(count);
    });
    return unsubscribe;
  }, []);

  // Initial data fetch
  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      try {
        if (isOnline) {
          const serverEntries = await apiClient.getEntries();
          setEntries(serverEntries);
          syncService.saveLocalEntries(serverEntries);
          setSyncStatus('synced');
        } else {
          const localEntries = syncService.getLocalEntries();
          setEntries(localEntries);
          setSyncStatus('offline');
        }
      } catch {
        // Fallback to local storage
        const localEntries = syncService.getLocalEntries();
        setEntries(localEntries);
        setSyncStatus(isOnline ? 'error' : 'offline');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, [isOnline]);

  // Process queue when coming back online
  useEffect(() => {
    if (isOnline && pendingCount > 0) {
      syncService.processQueue(isOnline);
    }
  }, [isOnline, pendingCount]);

  const addEntry = useCallback(async (entry: MoodData): Promise<boolean> => {
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = entries.findIndex(
      e => e.date.split('T')[0] === today
    );

    // Save previous state for potential rollback
    previousEntriesRef.current = [...entries];

    // Optimistic update
    let newEntries: MoodData[];
    if (existingIndex >= 0) {
      newEntries = [...entries];
      newEntries[existingIndex] = entry;
      toast.success('Mooood entry updated! 🐮✨');
    } else {
      newEntries = [...entries, entry];
      toast.success('New mooood entry added! 🌟🐮');
    }

    setEntries(newEntries);
    syncService.saveLocalEntries(newEntries);

    if (!isOnline) {
      syncService.enqueue(existingIndex >= 0 ? 'UPDATE' : 'CREATE', entry);
      return true;
    }

    // Try to sync immediately
    try {
      setSyncStatus('syncing');
      await apiClient.createEntry(entry);
      setSyncStatus('synced');
      return true;
    } catch {
      // Queue for later retry
      syncService.enqueue(existingIndex >= 0 ? 'UPDATE' : 'CREATE', entry);
      setSyncStatus('error');
      toast.error('Saved locally. Will sync when connection is restored.');
      return true; // Still successful locally
    }
  }, [entries, isOnline]);

  const deleteEntry = useCallback(async (entryDate: string): Promise<boolean> => {
    // Save previous state for potential rollback
    previousEntriesRef.current = [...entries];

    // Optimistic update
    const newEntries = entries.filter(e => e.date !== entryDate);
    setEntries(newEntries);
    syncService.saveLocalEntries(newEntries);
    toast.success('Entry deleted! 🗑');

    if (!isOnline) {
      syncService.enqueue('DELETE', { date: entryDate });
      return true;
    }

    // Try to sync immediately
    try {
      setSyncStatus('syncing');
      await apiClient.deleteEntry(entryDate);
      setSyncStatus('synced');
      return true;
    } catch {
      // Queue for later retry
      syncService.enqueue('DELETE', { date: entryDate });
      setSyncStatus('error');
      toast.error('Deleted locally. Will sync when connection is restored.');
      return true;
    }
  }, [entries, isOnline]);

  const rollback = useCallback(() => {
    if (previousEntriesRef.current.length > 0) {
      setEntries(previousEntriesRef.current);
      syncService.saveLocalEntries(previousEntriesRef.current);
      previousEntriesRef.current = [];
      toast.info('Changes reverted');
    }
  }, []);

  const exportCSV = useCallback((entry?: MoodData) => {
    const entriesToExport = entry ? [entry] : entries;

    const rows = entriesToExport.map(e => [
      format(new Date(e.date), 'yyyy-MM-dd'),
      e.mood,
      e.mixedState ? 'Yes' : 'No',
      e.sleep,
      e.uninterruptedSleep ? 'Yes' : 'No',
      e.medication.taken ? 'Yes' : 'No',
      e.medication.names,
      e.therapy.attended ? 'Yes' : 'No',
      e.supportGroup.attended ? 'Yes' : 'No',
      e.meals.count ?? '',
      e.meals.snacks ?? '',
      e.exercise.done ? 'Yes' : 'No',
      e.exercise.type,
      e.physicalHealth.symptoms,
      `Alcohol: ${e.substanceUse.alcohol ? 'Yes' : 'No'}, Drugs: ${e.substanceUse.drugs ? 'Yes' : 'No'}`,
      e.generalNotes,
    ].join(','));

    const csvContent = `${CSV_HEADERS.join(',')}\n${rows.join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    const filename = entry
      ? `mood_tracker_${format(new Date(entry.date), 'yyyy-MM-dd')}.csv`
      : 'mood_tracker_all_entries.csv';
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, [entries]);

  const importCSV = useCallback((file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const rows = text.split('\n').filter(row => row.trim());

          if (rows.length < 2) {
            reject(new Error('CSV file is empty or has no data rows'));
            return;
          }

          const newEntries: MoodData[] = rows.slice(1).map(row => {
            const values = row.split(',');
            return {
              date: values[0],
              mood: parseInt(values[1], 10) || 0,
              mixedState: values[2] === 'Yes',
              sleep: values[3] || '',
              uninterruptedSleep: values[4] === 'Yes',
              medication: {
                taken: values[5] === 'Yes',
                names: values[6] || '',
                notes: '',
              },
              therapy: {
                attended: values[7] === 'Yes',
                notes: '',
              },
              supportGroup: {
                attended: values[8] === 'Yes',
                notes: '',
              },
              meals: {
                count: values[9] ? parseInt(values[9], 10) : null,
                snacks: values[10] ? parseInt(values[10], 10) : null,
                notes: '',
              },
              exercise: {
                done: values[11] === 'Yes',
                type: values[12] || '',
                duration: '',
                notes: '',
              },
              relaxation: {
                done: false,
                duration: '',
                notes: '',
              },
              physicalHealth: {
                symptoms: values[13] || '',
                notes: '',
              },
              substanceUse: {
                alcohol: values[14]?.includes('Alcohol: Yes') || false,
                drugs: values[14]?.includes('Drugs: Yes') || false,
                notes: '',
              },
              generalNotes: values[15] || '',
            };
          });

          // Merge with existing entries, avoiding duplicates by date
          const existingDates = new Set(entries.map(e => e.date.split('T')[0]));
          const uniqueNewEntries = newEntries.filter(
            e => !existingDates.has(e.date.split('T')[0])
          );

          const mergedEntries = [...entries, ...uniqueNewEntries];
          setEntries(mergedEntries);
          syncService.saveLocalEntries(mergedEntries);

          // Queue all new entries for sync
          uniqueNewEntries.forEach(entry => {
            syncService.enqueue('CREATE', entry);
          });

          if (isOnline) {
            syncService.processQueue(true);
          }

          toast.success(`Imported ${uniqueNewEntries.length} entries! 📥`);
          resolve(uniqueNewEntries.length);
        } catch (error) {
          console.error('Error parsing CSV:', error);
          toast.error('Error uploading file. Please check the format.');
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }, [entries, isOnline]);

  const forceSync = useCallback(async (): Promise<boolean> => {
    if (!isOnline) {
      toast.error('Cannot sync while offline');
      return false;
    }

    setSyncStatus('syncing');
    const success = await syncService.processQueue(true);

    if (success) {
      // Refresh from server
      try {
        const serverEntries = await apiClient.getEntries();
        setEntries(serverEntries);
        syncService.saveLocalEntries(serverEntries);
        toast.success('Synced successfully! ✨');
      } catch {
        toast.error('Sync completed but failed to refresh');
      }
    }

    return success;
  }, [isOnline]);

  return {
    entries,
    isLoading,
    syncStatus,
    pendingCount,
    isOnline,
    addEntry,
    deleteEntry,
    rollback,
    exportCSV,
    importCSV,
    forceSync,
    createEmptyMoodData,
  };
}
