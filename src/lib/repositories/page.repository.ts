import { cache } from 'react';
import { PAGE_BY_SLUG_QUERY } from '../queries';
import { fetchAPI } from '../fetcher';

export const PageRepository = {
  getBySlug: cache(async (slug: string) => {
    const data = await fetchAPI(PAGE_BY_SLUG_QUERY, {
      variables: {
        id: slug,
        idType: 'URI',
      },
    });
    return data?.page;
  }),
};
