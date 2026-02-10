import { cache } from 'react';
import { PAGE_BY_SLUG_QUERY } from '../../sanity/lib/queries';
import { client } from '../../sanity/lib/client';
import { mapSanityPageToPage } from '../sanity/mapper';

export const PageRepository = {
  getBySlug: cache(async (slug: string) => {
    const page = await client.fetch(PAGE_BY_SLUG_QUERY, { slug });
    return mapSanityPageToPage(page);
  }),
};
