import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { format, subDays, subMonths, subYears, isWithinInterval } from 'date-fns';
import { Button } from '@/components/ui/button';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
    count: number;
    snacks: number;
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

interface MoodGraphProps {
  data: MoodData[];
}

type TimeRange = '7days' | '30days' | '1year';

export const MoodGraph: React.FC<MoodGraphProps> = ({ data }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7days');

  const getFilteredData = () => {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case '30days':
        startDate = subMonths(now, 1);
        break;
      case '1year':
        startDate = subYears(now, 1);
        break;
      default:
        startDate = subDays(now, 7);
    }

    return data.filter(entry => 
      isWithinInterval(new Date(entry.date), { start: startDate, end: now })
    );
  };

  const filteredData = getFilteredData();
  const labels = filteredData.map(entry => format(new Date(entry.date), 'MM/dd'));
  const moodValues = filteredData.map(entry => entry.mood);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Mood',
        data: moodValues,
        borderColor: 'rgb(147, 51, 234)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        min: -4,
        max: 4,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center">
        <Button
          variant={timeRange === '7days' ? 'default' : 'outline'}
          onClick={() => setTimeRange('7days')}
        >
          Week
        </Button>
        <Button
          variant={timeRange === '30days' ? 'default' : 'outline'}
          onClick={() => setTimeRange('30days')}
        >
          Month
        </Button>
        <Button
          variant={timeRange === '1year' ? 'default' : 'outline'}
          onClick={() => setTimeRange('1year')}
        >
          Year
        </Button>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};