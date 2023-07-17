import {
  Q_Data,
  Q_Diffucilty,
  Q_Level1,
  Q_Level2,
  Q_Level3,
  Q_Level4,
  Q_Levels,
  Q_Sheet,
  Q_event,
  Q_schema,
  SHEET_DIFFICULTY
} from '@/types/question';
import Joi from 'joi';

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
export const events: Q_event[] = ['History', 'Live'];

export const difficulty: Q_Diffucilty[] = [
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
  const trimedLabel = label.trim();
  switch (type) {
    case 'tags':
      return tags.indexOf(trimedLabel as Q_Levels);
    case 'difficulty':
      return difficulty.indexOf(trimedLabel as Q_Diffucilty);
    case 'event':
      return events.indexOf(trimedLabel as Q_event);
  }
};

export const shetDiffcultyTransformers = (
  label: SHEET_DIFFICULTY
): Q_Diffucilty => {
  switch (label) {
    case 'سهل':
      return 'Easy';
    case 'سهل جداً':
      return 'Very Easy';
    case 'صعب':
      return 'Hard';
    case 'صعب جداً':
      return 'Very Hard';
    case 'متوسط':
      return 'Medium';
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
      return events[index] as Q_event;
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
    ...data,
    answer: data.answer.filter((_, i) => i !== data.correctAnswer),
    correctAnswer: data.answer[data.correctAnswer],
    difficulty: Q_getLabel('difficulty', data.difficulty) as Q_Diffucilty,
    event: Q_getLabel('event', data.event) as Q_event,
    ...levels
  };
  return formatedData;
};

const questSchema = Joi.object({
  question: Joi.string().min(3).required(),
  answer: Joi.array().items(Joi.string()).length(3).required(),
  correctAnswer: Joi.number().max(2).min(0).required(),
  tags: Joi.array().items(Joi.number()).min(0).required(),
  difficulty: Joi.number().max(4).min(0).required(),
  event: Joi.number().max(4).min(0).required()
});

export const questSheetTransformer = (data: Q_Sheet): Omit<Q_schema, '_id'> => {
  // @ts-ignore
  let formatedData: Omit<Q_schema, '_id'> = {
    answer: [],
    tags: []
  };
  for (const [key, value] of Object.entries(data)) {
    let currentKey: keyof Q_Sheet | string;
    currentKey = (() => {
      let selectedKey = key.replaceAll(' ', '');
      return selectedKey.toLowerCase();
    })();
    if (currentKey.includes('question')) formatedData['question'] = value;
    else if (currentKey.includes('no.'))
      formatedData['answer'].push(value.toString());
    else if (currentKey.includes('tag'))
      formatedData['tags'].push(Q_getIndex('tags', value as Q_Levels));
    else if (currentKey.includes('difficulty')) {
      formatedData['difficulty'] = Q_getIndex(
        'difficulty',
        shetDiffcultyTransformers(value as SHEET_DIFFICULTY)
      );
    } else if (currentKey.includes('time'))
      formatedData['event'] = Q_getIndex('event', value as Q_event);
    else if (currentKey.includes('answer')) {
      const arrLength = formatedData['answer'].push(value.toString());
      console.log(arrLength);
      formatedData['correctAnswer'] = arrLength - 1;
    }
  }

  //  temp defaults
  formatedData['difficulty'] = formatedData['difficulty'] ?? 2;
  formatedData['answer'] = ['default', 'default 2 ', 'default 3 '];
  formatedData['event'] = formatedData['event'] ?? 0;
  if (formatedData['tags'].length === 0) formatedData['tags'] = [0];
  // validate data
  const { error } = questSchema.validate(formatedData);
  if (error) {
    console.log({ error, data, formatedData });

    throw new Error('schema validate');
  }
  return formatedData;
};
