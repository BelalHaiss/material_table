import { type } from 'os';

export interface Q_schema {
  question: string;
  answer: string[];
  correctAnswer: number;
  tags: number[];
  difficulty: number;
  event: number;
}

export interface Q_Query {
  limit: number;
  page: number;
  sort: string;
  difficulty: number;
  tags: string;
  event: number;
}

export interface Q_Response {
  currentPage: number;
  totalPage: number;
  data: Q_schema[];
}

export interface Q_Data {
  question: string;
  answer: string[]; // this answer is 2 length only and the correct answer below is the third item
  correctAnswer: string;
  level1: Q_Level1[];
  level2: Q_Level2[];
  level3: Q_Level3[];
  level4: Q_Level4[];
  difficulty: Q_Diffucilty;
  event: Q_event;
}

export type Q_Level1 = 'Individuals' | 'Teams' | 'General';
export type Q_Level2 =
  | 'T-shirts'
  | 'Nicknames'
  | 'Awards'
  | 'دوريات'
  | 'National Cups'
  | 'International Cups'
  | 'Incidents'
  | 'Logos'
  | 'Stadiums'
  | 'Rules'
  | 'Terminologies'
  | 'Games';
export type Q_Level3 = 'Top 5 Tiers' | 'Regional' | 'Clubs' | 'Countries';
export type Q_Level4 =
  | 'England'
  | 'Spain'
  | 'Italy'
  | 'Germany'
  | 'France'
  | 'Egypt'
  | 'Saudi'
  | 'Morocco';

export type Q_Levels = Q_Level1 | Q_Level2 | Q_Level3 | Q_Level4;

export type Q_event = 'History' | 'Live';
export type Q_Diffucilty =
  | 'Very Easy'
  | 'Easy'
  | 'Medium'
  | 'Hard'
  | 'Very Hard';
