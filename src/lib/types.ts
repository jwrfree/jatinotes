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
  }),
});

export const PostSchema = z.object({
  id: z.string(),
  databaseId: z.number().nullable().optional(),
  title: z.string(),
  slug: z.string(),
  date: z.string(),
  excerpt: z.string().nullable().optional().transform(val => val ?? ""),
  content: z.string().nullable().optional().transform(val => val ?? ""),
  featuredImage: FeaturedImageSchema.nullable().optional(),
  author: AuthorSchema.nullable().optional(),
  commentCount: z.number().nullable().optional().transform(val => val ?? 0),
  comments: z.object({
    nodes: z.array(z.any()),
  }).nullable().optional(),
});

export type Author = z.infer<typeof AuthorSchema>;
export type FeaturedImage = z.infer<typeof FeaturedImageSchema>;
export type Post = z.infer<typeof PostSchema>;

export type Category = {
  id: string;
  name: string;
  slug: string;
  count?: number;
  description?: string | null;
  posts?: {
    nodes: any[]; // Temporary use any for nodes to bypass strict Zod mismatch in recursive schema
  };
  children?: {
    nodes: Category[];
  };
};

export const CategorySchema: z.ZodType<Category> = z.lazy(() => z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  count: z.number().optional(),
  description: z.string().nullable().optional(),
  posts: z.object({
    nodes: z.array(PostSchema),
  }).optional(),
  children: z.object({
    nodes: z.array(CategorySchema),
  }).optional(),
}));

export interface Comment {
  id: string;
  databaseId: number;
  content: string;
  date: string;
  parentDatabaseId: number | null;
  author: {
    node: {
      name: string;
      avatar: {
        url: string;
      } | null;
    };
  };
}
