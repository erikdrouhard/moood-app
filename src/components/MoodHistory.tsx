import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Download } from 'lucide-react';
import { format } from 'date-fns';

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
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Previous Entries</h3>
      {entries.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No entries yet! Time to start your mooood journey! 🌱
        </p>
      ) : (
        entries
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((entry) => (
            <div 
              key={entry.date} 
              className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow"
            >
              <div className="flex items-center gap-2">
                <span>{format(new Date(entry.date), 'yyyy-MM-dd')}</span>
                <span className="text-purple-600">
                  {entry.mood > 0 ? '↑' : entry.mood < 0 ? '↓' : '→'} {entry.mood}
                </span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(entry)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDownload(entry)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDelete(entry.date)}
                  className="bg-red-200 hover:bg-red-300 border-red-300"
                >
                  🗑️
                </Button>
              </div>
            </div>
          ))
      )}
    </div>
  );
};
