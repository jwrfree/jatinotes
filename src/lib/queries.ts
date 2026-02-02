/**
 * GraphQL Fragments for reusability
 */
export const POST_FIELDS_FRAGMENT = `
  fragment PostFields on Post {
    id
    databaseId
    title
    slug
    excerpt
    content
    date
    featuredImage {
      node {
        sourceUrl
      }
    }
    author {
      node {
        name
        avatar {
          url
        }
      }
    }
  }
`;

export const COMMENT_FIELDS_FRAGMENT = `
  fragment CommentFields on Comment {
    id
    databaseId
    content
    date
    parentDatabaseId
    author {
      node {
        name
        avatar {
          url
        }
      }
    }
  }
`;

/**
 * GraphQL Queries
 */
export const ALL_POSTS_QUERY = `
  ${POST_FIELDS_FRAGMENT}
  query AllPosts {
    posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        ...PostFields
      }
    }
  }
`;

export const POST_BY_SLUG_QUERY = `
  ${POST_FIELDS_FRAGMENT}
  ${COMMENT_FIELDS_FRAGMENT}
  query PostBySlug($id: ID!, $idType: PostIdType!) {
    post(id: $id, idType: $idType) {
      ...PostFields
      commentCount
      comments(first: 100, where: { orderby: COMMENT_DATE, order: ASC }) {
        nodes {
          ...CommentFields
        }
      }
    }
  }
`;

export const CATEGORY_POSTS_QUERY = `
  ${POST_FIELDS_FRAGMENT}
  query PostsByCategory($id: ID!, $idType: CategoryIdType!) {
    category(id: $id, idType: $idType) {
      id
      name
      slug
      description
      children(where: { hideEmpty: true }) {
        nodes {
          id
          name
          slug
          count
        }
      }
      posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          ...PostFields
        }
      }
    }
  }
`;

export const SEARCH_POSTS_QUERY = `
  ${POST_FIELDS_FRAGMENT}
  query SearchPosts($search: String!) {
    posts(first: 20, where: { search: $search }) {
      nodes {
        ...PostFields
      }
    }
  }
`;

export const ALL_CATEGORIES_QUERY = `
  query AllCategories {
    categories(first: 100) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`;

export const PAGE_BY_SLUG_QUERY = `
  query PageBySlug($id: ID!, $idType: PageIdType!) {
    page(id: $id, idType: $idType) {
      id
      title
      content
      date
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`;

/**
 * GraphQL Mutations
 */
export const CREATE_COMMENT_MUTATION = `
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      success
      comment {
        id
        content
        author {
          node {
            name
          }
        }
      }
    }
  }
`;
