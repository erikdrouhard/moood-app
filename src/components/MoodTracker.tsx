import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Download, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from "@/components/ui/switch"
import { MoodGraph } from './MoodGraph';
import WelcomeUser from './WelcomeUser';
import { cn } from '@/lib/utils';
import { MoodHistory } from './MoodHistory';
import MoodSummary from './MoodSummary';
import { Toaster, toast } from 'sonner';
import Leaderboard from './Leaderboard';


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

const MoodTracker = () => {
  const [currentPage, setCurrentPage] = useState(-1);
  const [summaryData, setSummaryData] = useState<MoodData | null>(null);
  const [moodData, setMoodData] = useState<MoodData>({
    date: new Date().toISOString(),
    mood: 0,
    mixedState: false,
    sleep: '',
    uninterruptedSleep: false,
    medication: {
      taken: false,
      names: '',
      notes: ''
    },
    therapy: {
      attended: false,
      notes: ''
    },
    supportGroup: {
      attended: false,
      notes: ''
    },
    meals: {
      count: null,
      snacks: null,
      notes: ''
    },
    exercise: {
      done: false,
      type: '',
      duration: '',
      notes: ''
    },
    relaxation: {
      done: false,
      duration: '',
      notes: ''
    },
    physicalHealth: {
      symptoms: '',
      notes: ''
    },
    substanceUse: {
      alcohol: false,
      drugs: false,
      notes: ''
    },
    generalNotes: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodData[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/entries`)
      .then(res => res.json())
      .then(data => setMoodHistory(data))
      .catch(() => {
        const savedData = localStorage.getItem('moodHistory');
        if (savedData) setMoodHistory(JSON.parse(savedData));
      });
  }, []);

  const handleSubmit = () => {
    const today = new Date().toISOString().split('T')[0];
    const existingEntryIndex = moodHistory.findIndex(
      entry => entry.date.split('T')[0] === today
    );

    let newHistory;
    if (existingEntryIndex >= 0) {
      // Update existing entry
      newHistory = [...moodHistory];
      newHistory[existingEntryIndex] = moodData;
      toast.success('Mooood entry updated! 🐮✨');
    } else {
      // Add new entry
      newHistory = [...moodHistory, moodData];
      toast.success('New mooood entry added! 🌟🐮');
    }

    setMoodHistory(newHistory);
    localStorage.setItem('moodHistory', JSON.stringify(newHistory));
    fetch(`${API_BASE}/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(moodData)
    }).catch(() => {});
    setSummaryData(moodData);
    setIsEditing(false);
    setCurrentPage(-1);
    setMoodData({
      date: new Date().toISOString(),
      mood: 0,
      mixedState: false,
      sleep: '',
      uninterruptedSleep: false,
      medication: {
        taken: false,
        names: '',
        notes: ''
      },
      therapy: {
        attended: false,
        notes: ''
      },
      supportGroup: {
        attended: false,
        notes: ''
      },
      meals: {
        count: null,
        snacks: null,
        notes: ''
      },
      exercise: {
        done: false,
        type: '',
        duration: '',
        notes: ''
      },
      relaxation: {
        done: false,
        duration: '',
        notes: ''
      },
      physicalHealth: {
        symptoms: '',
        notes: ''
      },
      substanceUse: {
        alcohol: false,
        drugs: false,
        notes: ''
      },
      generalNotes: ''
    });
  };

  const handleEdit = (entry: MoodData) => {
    setMoodData(entry);
    setIsEditing(true);
    setCurrentPage(0);
  };

  const downloadCSV = (entry: MoodData) => {
    const formatDate = format(new Date(entry.date), 'yyyy-MM-dd');
    const headers = [
      'Date', 'Mood', 'Mixed State', 'Sleep Hours', 'Uninterrupted Sleep',
      'Medications Taken', 'Medication Names', 'Therapy', 'Support Group',
      'Meals', 'Snacks', 'Exercise', 'Exercise Type', 'Physical Symptoms',
      'Substance Use', 'Notes'
    ].join(',');

    const values = [
      formatDate,
      entry.mood,
      entry.mixedState ? 'Yes' : 'No',
      entry.sleep,
      entry.uninterruptedSleep ? 'Yes' : 'No',
      entry.medication.taken ? 'Yes' : 'No',
      entry.medication.names,
      entry.therapy.attended ? 'Yes' : 'No',
      entry.supportGroup.attended ? 'Yes' : 'No',
      entry.meals.count ?? '',
      entry.meals.snacks ?? '',
      entry.exercise.done ? 'Yes' : 'No',
      entry.exercise.type,
      entry.physicalHealth.symptoms,
      `Alcohol: ${entry.substanceUse.alcohol ? 'Yes' : 'No'}, Drugs: ${entry.substanceUse.drugs ? 'Yes' : 'No'}`,
      entry.generalNotes
    ].join(',');

    const csvContent = `${headers}\n${values}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `mood_tracker_${formatDate}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDelete = (entryDate: string) => {
    const newHistory = moodHistory.filter(entry => entry.date !== entryDate);
    setMoodHistory(newHistory);
    localStorage.setItem('moodHistory', JSON.stringify(newHistory));
    toast.success('Entry deleted! 🗑');
    fetch(`${API_BASE}/entries`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date: entryDate })
    }).catch(() => {});
  };

  const downloadAllCSV = () => {
    const headers = [
      'Date', 'Mood', 'Mixed State', 'Sleep Hours', 'Uninterrupted Sleep',
      'Medications Taken', 'Medication Names', 'Therapy', 'Support Group',
      'Meals', 'Snacks', 'Exercise', 'Exercise Type', 'Physical Symptoms',
      'Substance Use', 'Notes'
    ].join(',');

    const rows = moodHistory.map(entry => [
      format(new Date(entry.date), 'yyyy-MM-dd'),
      entry.mood,
      entry.mixedState ? 'Yes' : 'No',
      entry.sleep,
      entry.uninterruptedSleep ? 'Yes' : 'No',
      entry.medication.taken ? 'Yes' : 'No',
      entry.medication.names,
      entry.therapy.attended ? 'Yes' : 'No',
      entry.supportGroup.attended ? 'Yes' : 'No',
      entry.meals.count ?? '',
      entry.meals.snacks ?? '',
      entry.exercise.done ? 'Yes' : 'No',
      entry.exercise.type,
      entry.physicalHealth.symptoms,
      `Alcohol: ${entry.substanceUse.alcohol ? 'Yes' : 'No'}, Drugs: ${entry.substanceUse.drugs ? 'Yes' : 'No'}`,
      entry.generalNotes
    ].join(','));

    const csvContent = `${headers}\n${rows.join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `mood_tracker_all_entries.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleBulkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n');
        const newEntries = rows.slice(1).map(row => {
          const values = row.split(',');
          return {
            date: values[0],
            mood: parseInt(values[1]),
            mixedState: values[2] === 'Yes',
            sleep: values[3],
            uninterruptedSleep: values[4] === 'Yes',
            medication: {
              taken: values[5] === 'Yes',
              names: values[6],
              notes: ''
            },
            therapy: {
              attended: values[7] === 'Yes',
              notes: ''
            },
            supportGroup: {
              attended: values[8] === 'Yes',
              notes: ''
            },
            meals: {
              count: values[9] ? parseInt(values[9], 10) : null,
              snacks: values[10] ? parseInt(values[10], 10) : null,
              notes: ''
            },
            exercise: {
              done: values[11] === 'Yes',
              type: values[12],
              duration: '',
              notes: ''
            },
            relaxation: {
              done: false,
              duration: '',
              notes: ''
            },
            physicalHealth: {
              symptoms: values[13],
              notes: ''
            },
            substanceUse: {
              alcohol: values[14].includes('Alcohol: Yes'),
              drugs: values[14].includes('Drugs: Yes'),
              notes: ''
            },
            generalNotes: values[15] || ''
          } as MoodData;
        });

        setMoodHistory(prev => [...prev, ...newEntries]);
        localStorage.setItem('moodHistory', JSON.stringify([...moodHistory, ...newEntries]));
        toast.success('Entries imported successfully! 📥');
      } catch (error) {
        console.error('Error parsing CSV:', error);
        toast.error('Error uploading file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  const pages = [
    {
      title: "Mooood Dashboard 🐮",
      component: (
        <div className="space-y-6">
          <WelcomeUser />
          <MoodGraph data={moodHistory} />
          <div className="flex justify-center gap-4 mb-6">
            <Button 
              onClick={() => setCurrentPage(1)}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🌟 Hay! Let's Track Today's Moood! 
            </Button>
          </div>
          <MoodHistory 
            entries={moodHistory} 
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDownload={downloadCSV}
          />
          <div className="flex gap-4 mt-6">
            <Button 
              onClick={downloadAllCSV}
              variant="outline"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
            <label className="w-full">
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById('csvUpload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload CSV
              </Button>
              <input
                id="csvUpload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleBulkUpload}
              />
            </label>
          </div>
        </div>
      )
    },
    {
      title: "How are you Moood-ing today? 🐮",
      component: (
        <div className="space-y-6">
          <Label className="block text-lg font-medium">
            Slide to match your mood
          </Label>
          <div className="relative">
            <Slider
              value={[moodData.mood]}
              max={4}
              min={-4}
              step={1}
              className="w-full"
              onValueChange={(value) => setMoodData({...moodData, mood: value[0]})}
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span>😔 Low</span>
              <span>😌 Stable</span>
              <span>😄 High</span>
            </div>
          </div>
          <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <div className="text-2xl mb-2">
              {moodData.mood <= -3 ? '😔' : moodData.mood <= -1 ? '😐' : moodData.mood === 0 ? '😌' : moodData.mood <= 2 ? '😊' : '😄'}
            </div>
            <div className="text-sm font-medium text-purple-700 dark:text-purple-300">
              {moodData.mood === 0 ? "Stable as a barn! 🏠" :
               moodData.mood > 0 ? `Feeling more energetic than usual (${moodData.mood > 2 ? 'Very High' : 'Elevated'})` :
               `Feeling lower than usual (${moodData.mood < -2 ? 'Very Low' : 'Low'})`}
            </div>
          </div>
          <div className="mt-4">
            <Label className="block text-lg font-medium mb-2">
              Mixed State?
            </Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={moodData.mixedState}
                onCheckedChange={(checked: boolean) => 
                  setMoodData({...moodData, mixedState: checked})}
              />
              <Label>Experiencing both high and low symptoms</Label>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Sleep Time! 💤",
      component: (
        <div className="space-y-6">
          <div className="space-y-4">
            <Label className="block text-lg">Hours of Sleep</Label>
            <div className="relative">
              <Input 
                type="number" 
                placeholder="0"
                className="text-center text-xl font-semibold pl-8 pr-12"
                value={moodData.sleep}
                onChange={(e) => setMoodData({...moodData, sleep: e.target.value})}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">💤</span>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">hours</span>
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox
                id="uninterrupted"
                checked={moodData.uninterruptedSleep}
                onCheckedChange={(checked) => 
                  setMoodData({...moodData, uninterruptedSleep: checked as boolean})}
              />
              <Label htmlFor="uninterrupted" className="cursor-pointer">
                Uninterrupted Sleep
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  {moodData.uninterruptedSleep ? '✨ Great!' : ''}
                </span>
              </Label>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Medications & Support 💊",
      component: (
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medication"
                  checked={moodData.medication.taken}
                  onCheckedChange={(checked) => 
                    setMoodData({
                      ...moodData, 
                      medication: {...moodData.medication, taken: checked as boolean}
                    })}
                />
                <Label htmlFor="medication" className="cursor-pointer font-medium">
                  💊 Took medications today
                </Label>
              </div>
              {moodData.medication.taken && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3"
                >
                  <Input
                    placeholder="Which medications? (optional)"
                    value={moodData.medication.names}
                    onChange={(e) => setMoodData({
                      ...moodData, 
                      medication: {...moodData.medication, names: e.target.value}
                    })}
                    className="bg-white dark:bg-gray-800"
                  />
                </motion.div>
              )}
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="therapy"
                  checked={moodData.therapy.attended}
                  onCheckedChange={(checked) => 
                    setMoodData({
                      ...moodData, 
                      therapy: {...moodData.therapy, attended: checked as boolean}
                    })}
                />
                <Label htmlFor="therapy" className="cursor-pointer font-medium">
                  🧠 Attended therapy today
                </Label>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="support"
                  checked={moodData.supportGroup.attended}
                  onCheckedChange={(checked) => 
                    setMoodData({
                      ...moodData, 
                      supportGroup: {...moodData.supportGroup, attended: checked as boolean}
                    })}
                />
                <Label htmlFor="support" className="cursor-pointer font-medium">
                  🤝 Attended support group
                </Label>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Nutrition & Exercise 🥗",
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meals" className="text-sm font-medium flex items-center gap-1">
                🍽️ Meals Today
              </Label>
              <Input
                id="meals"
                type="number"
                min="0"
                max="10"
                placeholder="0"
                className="text-center font-semibold"
                value={moodData.meals.count ?? ''}
                onChange={(e) => setMoodData({
                  ...moodData,
                  meals: {
                    ...moodData.meals,
                    count: e.target.value === '' ? null : parseInt(e.target.value, 10)
                  }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="snacks" className="text-sm font-medium flex items-center gap-1">
                🍎 Snacks Today
              </Label>
              <Input
                id="snacks"
                type="number"
                min="0"
                max="10"
                placeholder="0"
                className="text-center font-semibold"
                value={moodData.meals.snacks ?? ''}
                onChange={(e) => setMoodData({
                  ...moodData,
                  meals: {
                    ...moodData.meals,
                    snacks: e.target.value === '' ? null : parseInt(e.target.value, 10)
                  }
                })}
              />
            </div>
          </div>
          <div className="space-y-4">
            <Label htmlFor="snacks">Number of Snacks</Label>
            <Input
              id="snacks"
              type="number"
              min="0"
              max="10"
              value={moodData.meals.snacks ?? ''}
              onChange={(e) => setMoodData({
                ...moodData,
                meals: {
                  ...moodData.meals,
                  snacks: e.target.value === '' ? null : parseInt(e.target.value, 10)
                }
              })}
            />
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              id="exercise"
              checked={moodData.exercise.done}
              onCheckedChange={(checked) => 
                setMoodData({
                  ...moodData, 
                  exercise: {...moodData.exercise, done: checked as boolean}
                })}
            />
            <Label htmlFor="exercise">Exercised today</Label>
          </div>
          {moodData.exercise.done && (
            <Input
              placeholder="Type & duration of exercise"
              value={moodData.exercise.type}
              onChange={(e) => setMoodData({
                ...moodData,
                exercise: {...moodData.exercise, type: e.target.value}
              })}
            />
          )}
        </div>
      )
    },
    {
      title: "Other Health Notes 🏥",
      component: (
        <div className="space-y-6">
          <Textarea
            placeholder="Any physical health symptoms today?"
            value={moodData.physicalHealth.symptoms}
            onChange={(e) => setMoodData({
              ...moodData,
              physicalHealth: {...moodData.physicalHealth, symptoms: e.target.value}
            })}
          />
          <div className="space-y-4">
            <Label>Substance Use</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="alcohol"
                checked={moodData.substanceUse.alcohol}
                onCheckedChange={(checked) => 
                  setMoodData({
                    ...moodData, 
                    substanceUse: {...moodData.substanceUse, alcohol: checked as boolean}
                  })}
              />
              <Label htmlFor="alcohol">Alcohol</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="drugs"
                checked={moodData.substanceUse.drugs}
                onCheckedChange={(checked) => 
                  setMoodData({
                    ...moodData, 
                    substanceUse: {...moodData.substanceUse, drugs: checked as boolean}
                  })}
              />
              <Label htmlFor="drugs">Other substances</Label>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Additional Notes 📝",
      component: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              How was your day overall? Any other thoughts?
            </Label>
            <Textarea
              id="notes"
              placeholder="Share anything else on your mind... 🐮"
              className="h-32 resize-none"
              value={moodData.generalNotes}
              onChange={(e) => setMoodData({...moodData, generalNotes: e.target.value})}
            />
          </div>
          
          <div className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg text-center">
            <p className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-2">
              Ready to save your entry! 🎆
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You're doing great! Every day is a mooo-ving journey 🐄
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-purple-900 dark:to-blue-950">
      <Toaster position="top-center" richColors />
      <Leaderboard />
      {summaryData && (
        <MoodSummary data={summaryData} onClose={() => setSummaryData(null)} />
      )}
      {/* Motivational messages can be added here if needed */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-[480px] mx-auto"
        >
          <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
            <CardContent className="p-8">
              {currentPage === -1 ? (
                pages[0].component
              ) : (
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="relative">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <div className="absolute -top-6 right-0 text-xs text-gray-500 dark:text-gray-400">
                        Step {currentPage + 1} of {pages.length}
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center">
                      {pages[currentPage].title}
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    {pages[currentPage].component}
                  </div>

                  <div className="flex justify-between mt-8 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => currentPage === 0 ? setCurrentPage(-1) : setCurrentPage(currentPage - 1)}
                      className={cn(
                        "w-full sm:w-auto px-4",
                        "transition-all duration-200 ease-in-out",
                        "flex items-center justify-center gap-2",
                        "hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      )}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sm:hidden">Back</span>
                    </Button>

                    {currentPage === pages.length - 1 ? (
                      <Button
                        onClick={handleSubmit}
                        className={cn(
                          "w-full sm:w-auto px-6",
                          "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
                          "transition-all duration-200 ease-in-out shadow-lg",
                          "flex items-center justify-center gap-2 text-white"
                        )}
                      >
                        <span>{isEditing ? 'Update' : 'Submit'}</span>
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className={cn(
                          "w-full sm:w-auto px-4",
                          "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
                          "transition-all duration-200 ease-in-out shadow-lg",
                          "flex items-center justify-center gap-2 text-white"
                        )}
                      >
                        <span className="sm:hidden">Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MoodTracker;