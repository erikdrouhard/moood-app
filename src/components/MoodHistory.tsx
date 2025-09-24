import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Download, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MoodHistoryProps {
  entries: MoodData[];
  onEdit: (entry: MoodData) => void;
  onDelete: (date: string) => void;
  onDownload: (entry: MoodData) => void;
}

interface MoodData {
  date: string;
  mood: number;
  mixedState: boolean;
  sleep: string;
  uninterruptedSleep: boolean;
  medication: {
    taken: boolean;
    names: string;
    notes: string;
  };
  therapy: {
    attended: boolean;
    notes: string;
  };
  supportGroup: {
    attended: boolean;
    notes: string;
  };
  meals: {
    count: number | null;
    snacks: number | null;
    notes: string;
  };
  exercise: {
    done: boolean;
    type: string;
    duration: string;
    notes: string;
  };
  relaxation: {
    done: boolean;
    duration: string;
    notes: string;
  };
  physicalHealth: {
    symptoms: string;
    notes: string;
  };
  substanceUse: {
    alcohol: boolean;
    drugs: boolean;
    notes: string;
  };
  generalNotes: string;
}

export const MoodHistory: React.FC<MoodHistoryProps> = ({ 
  entries, 
  onEdit, 
  onDelete,
  onDownload 
}) => {
  const getMoodEmoji = (mood: number) => {
    if (mood <= -3) return '😔';
    if (mood <= -1) return '😐';
    if (mood === 0) return '😌';
    if (mood <= 2) return '😊';
    return '😄';
  };

  const getMoodColor = (mood: number) => {
    if (mood < 0) return 'text-blue-600 dark:text-blue-400';
    if (mood === 0) return 'text-gray-600 dark:text-gray-400';
    return 'text-purple-600 dark:text-purple-400';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <span>Previous Entries</span>
        <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
          ({entries.length} total)
        </span>
      </h3>
      {entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
        >
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            No entries yet! Time to start your mooood journey! 🌱
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Click "Track Today's Moood" above to begin
          </p>
        </motion.div>
      ) : (
        <AnimatePresence>
          {entries
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((entry, index) => (
              <motion.div
                key={entry.date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: Math.min(index * 0.01, 0.1) }}
                className="group relative overflow-hidden"
              >
                <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {format(new Date(entry.date), 'EEEE, MMM d')}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className={cn("font-semibold", getMoodColor(entry.mood))}>
                          Mood: {entry.mood > 0 ? '+' : ''}{entry.mood}
                        </span>
                        {entry.mixedState && (
                          <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full">
                            Mixed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEdit(entry)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onDownload(entry)}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onDelete(entry.date)}
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      )}
    </div>
  );
};
