import React from 'react';
import { MoodData } from '@/types/mood';
import Confetti from './Confetti';
import { Button } from '@/components/ui/button';

interface Props {
  data: MoodData;
  onClose: () => void;
}

const quotes = [
  'Great job staying mindful today!',
  'Every step counts, keep going!',
  'You are doing amazing, celebrate the wins!',
];

const getQuote = () => quotes[Math.floor(Math.random() * quotes.length)];

const MoodSummary: React.FC<Props> = ({ data, onClose }) => {
  const lines = [
    `Mood: ${data.mood}/10${data.mixedState ? ' (mixed state)' : ''}`,
    `Sleep: ${data.sleep}h${data.uninterruptedSleep ? ', uninterrupted' : ''}`,
    data.medication.taken ? 'Medication taken' : 'No medication taken',
    data.therapy.attended ? 'Therapy attended' : 'Therapy missed',
    data.supportGroup.attended ? 'Support group attended' : 'Support group missed',
    data.exercise.done ? `Exercise: ${data.exercise.type}` : 'No exercise today',
    data.meals.count !== null ? `Meals: ${data.meals.count}` : 'Meals not logged',
  ];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 max-w-sm w-full text-center">
        <h2 className="text-xl font-bold text-purple-700 dark:text-purple-300">Daily Summary</h2>
        <ul className="text-left list-disc list-inside space-y-1">
          {lines.map((line, idx) => (
            <li key={idx}>{line}</li>
          ))}
          {data.generalNotes && <li>Notes: {data.generalNotes}</li>}
        </ul>
        <p className="font-semibold">{getQuote()}</p>
        <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={onClose}>Awesome!</Button>
      </div>
      <Confetti />
    </div>
  );
};

export default MoodSummary;
