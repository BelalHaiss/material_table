import {
  Q_Data,
  Q_Diffucilty,
  Q_Level1,
  Q_Level2,
  Q_Level3,
  Q_Level4,
  Q_Levels,
  Q_event,
  Q_schema
} from '@/types/question';

export const level1_tags: Q_Level1[] = ['General', 'Individuals', 'Teams'];
export const level2_tags: Q_Level2[] = [
  'Awards',
  'Games',
  'Incidents',
  'International Cups',
  'Logos',
  'National Cups',
  'Nicknames',
  'Rules',
  'Stadiums',
  'T-shirts',
  'Terminologies',
  'دوريات'
];
export const level3_tags: Q_Level3[] = [
  'Clubs',
  'Countries',
  'Regional',
  'Top 5 Tiers'
];
export const level4_tags: Q_Level4[] = [
  'Egypt',
  'England',
  'Saudi',
  'Spain',
  'France',
  'Germany',
  'Italy',
  'Morocco'
];

const tags: Q_Levels[] = [
  'Individuals',
  'Teams',
  'General',
  'T-shirts',
  'Nicknames',
  'Awards',
  'دوريات',
  'National Cups',
  'International Cups',
  'Incidents',
  'Logos',
  'Stadiums',
  'Rules',
  'Terminologies',
  'Games',
  'Top 5 Tiers',
  'Regional',
  'Clubs',
  'Countries',
  'England',
  'Spain',
  'Italy',
  'Germany',
  'France',
  'Egypt',
  'Saudi',
  'Morocco'
];
const event: Q_event[] = ['History', 'Live'];

const difficulty: Q_Diffucilty[] = [
  'Very Easy',
  'Easy',
  'Medium',
  'Hard',
  'Very Hard'
];

export const Q_getIndex = <T extends Q_Levels | Q_event | Q_Diffucilty>(
  type: 'tags' | 'event' | 'difficulty',
  label: T
) => {
  switch (type) {
    case 'tags':
      return tags.indexOf(label as Q_Levels);
    case 'difficulty':
      return difficulty.indexOf(label as Q_Diffucilty);
    case 'event':
      return event.indexOf(label as Q_event);
  }
};
export const Q_getLabel = (
  type: 'tags' | 'event' | 'difficulty',
  index: number
) => {
  switch (type) {
    case 'difficulty':
      return difficulty[index] as Q_Diffucilty;
    case 'event':
      return event[index] as Q_event;
    case 'tags':
      return tags[index] as Q_Levels;
  }
};

export const tagsIndexToLabels = (dataTags: number[]): Q_Levels[] =>
  dataTags.map((Tagindex) => tags[Tagindex]);

export const levelTransformer = (
  tags: Q_Levels[]
): Pick<Q_Data, 'level1' | 'level2' | 'level3' | 'level4'> => {
  let level1: Q_Level1[] = [],
    level2: Q_Level2[] = [],
    level3: Q_Level3[] = [],
    level4: Q_Level4[] = [];

  for (const tag of tags) {
    level1_tags.includes(tag as any) && level1.push(tag as Q_Level1);
    level2_tags.includes(tag as any) && level2.push(tag as Q_Level2);
    level3_tags.includes(tag as any) && level3.push(tag as Q_Level3);
    level4_tags.includes(tag as any) && level4.push(tag as Q_Level4);
  }

  return { level1, level2, level3, level4 };
};

export const questionTransformer = (data: Q_schema): Q_Data => {
  const levels = levelTransformer(tagsIndexToLabels(data.tags));
  const formatedData: Q_Data = {
    answer: data.answer.filter((_, i) => i !== data.correctAnswer),
    correctAnswer: data.answer[data.correctAnswer],
    difficulty: Q_getLabel('difficulty', data.difficulty) as Q_Diffucilty,
    event: Q_getLabel('event', data.event) as Q_event,
    ...levels,
    question: data.question
  };
  return formatedData;
};
