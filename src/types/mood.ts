export interface MoodData {
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