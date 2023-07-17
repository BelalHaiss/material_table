import { Q_Query, Q_schema } from '@/types/question';
import { fetcher } from '@/util/fetcher';

export const deleteQuestions = async (ids: string[]) => {
  const res = await fetcher({
    url: 'question',
    requestOption: {
      method: 'DELETE',
      data: ids
    }
  });
  return res;
};
export const addQuestions = async (data: Omit<Q_schema, '_id'>[]) => {
  const res = await fetcher({
    url: 'question/create',
    requestOption: {
      method: 'POST',
      data
    }
  });
  return res;
};

export const FetchQuesttion = (query: Partial<Q_Query>) => {};
