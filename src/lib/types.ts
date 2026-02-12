import { z } from "zod";

export const AuthorSchema = z.object({
  node: z.object({
    name: z.string(),
    avatar: z.object({
      url: z.string(),
    }).nullable().optional(),
  }),
});

export const FeaturedImageSchema = z.object({
  node: z.object({
    sourceUrl: z.string(),
    mediaDetails: z.object({
      width: z.number(),
      height: z.number(),
    }).nullable().optional(),
  }),
});

export const CommentSchema = z.object({
  id: z.string(),
  databaseId: z.number().nullable().optional(),
  content: z.string(),
  date: z.string(),
  parentId: z.string().nullable().optional(),
  parentDatabaseId: z.number().nullable().optional(),
  author: z.object({
    node: z.object({
      name: z.string(),
      avatar: z.object({
        url: z.string(),
      }).nullable().optional(),
    }),
  }).nullable().optional(),
});

export const PostSchema = z.object({
  id: z.string(),
  databaseId: z.number().nullable().optional(),
  title: z.string(),
  slug: z.string(),
  date: z.string(),
  excerpt: z.string().nullable().optional().transform(val => val ?? ""),
  content: z.union([z.string(), z.array(z.any())]).nullable().optional(),
  wordCount: z.number().nullable().optional(), // Character count from Sanity
  featuredImage: FeaturedImageSchema.nullable().optional(),
  author: AuthorSchema.nullable().optional(),
  commentCount: z.number().nullable().optional().transform(val => val ?? 0),
  comments: z.object({
    nodes: z.array(CommentSchema),
  }).nullable().optional(),
  categories: z.object({
    nodes: z.array(z.object({
      name: z.string(),
      slug: z.string(),
    })),
  }).nullable().optional(),
  tags: z.object({
    nodes: z.array(z.object({
      name: z.string(),
      slug: z.string(),
    })),
  }).nullable().optional(),
  bookTitle: z.string().nullable().optional(),
  bookAuthor: z.string().nullable().optional(),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    focusKeyword: z.string().optional(),
    ogImage: z.string().optional(),
    noIndex: z.boolean().optional(),
    canonicalUrl: z.string().optional(),
  }).nullable().optional(),
});

export type Author = z.infer<typeof AuthorSchema>;
export type FeaturedImage = z.infer<typeof FeaturedImageSchema>;
export type Post = z.infer<typeof PostSchema>;

export const PageSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().nullable().optional().transform(val => val ?? ""),
  content: z.union([z.string(), z.array(z.any())]).nullable().optional(),
  featuredImage: FeaturedImageSchema.nullable().optional(),
});

export type Page = z.infer<typeof PageSchema>;

export const PageInfoSchema = z.object({
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  startCursor: z.string().nullable().optional(),
  endCursor: z.string().nullable().optional(),
});

export type PageInfo = z.infer<typeof PageInfoSchema>;

export type Category = {
  id: string;
  name: string;
  slug: string;
  parent?: string;
  count?: number;
  description?: string | null;
  color?: string;
  posts?: {
    nodes: Post[];
    pageInfo?: PageInfo;
  };
  children?: {
    nodes: Category[];
  };
};

export const CategorySchema: z.ZodType<Category, z.ZodTypeDef, unknown> = z.lazy(() => z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  count: z.number().optional(),
  description: z.string().nullable().optional(),
  posts: z.object({
    nodes: z.array(PostSchema),
    pageInfo: PageInfoSchema.optional(),
  }).optional(),
  children: z.object({
    nodes: z.array(CategorySchema),
  }).optional(),
}));

export type Comment = z.infer<typeof CommentSchema> & {
  children?: Comment[];
};
