export interface Author {
  node: {
    name: string;
    avatar?: {
      url: string;
    };
  };
}

export interface FeaturedImage {
  node: {
    sourceUrl: string;
  };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content?: string;
  featuredImage?: FeaturedImage;
  author?: Author;
  commentCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
  description?: string;
  posts?: {
    nodes: Post[];
  };
  children?: {
    nodes: Category[];
  };
}
