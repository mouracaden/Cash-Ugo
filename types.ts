export interface Participant {
  id: string;
  name: string;
  title: string;
  annualSalary: number;
  ratePerSecond: number;
}

export type TopicStatus = 'pending' | 'active' | 'paused' | 'completed';

export interface Topic {
  id: string;
  title: string;
  status: TopicStatus;
  accumulatedCost: number;
  durationSeconds: number;
}

export interface AppState {
  participants: Participant[];
  topics: Topic[];
  activeTopicId: string | null;
  totalMeetingCost: number; // Historical + current session
  isMeetingEnded: boolean;
  lastTick: number | null;
}

export const HOURS_PER_DAY = 7.5;
export const DAYS_PER_YEAR = 220;