import { CREATE_COMMENT_MUTATION } from '../queries';
import { fetchAPI } from '../api';

export const CommentRepository = {
  create: async (input: {
    content: string;
    author: string;
    authorEmail: string;
    postId: number;
  }) => {
    const data = await fetchAPI(CREATE_COMMENT_MUTATION, {
      variables: { 
        input: {
          author: input.author,
          authorEmail: input.authorEmail,
          content: input.content,
          commentOn: input.postId
        }
      },
      revalidate: false
    });
    return data?.createComment;
  },
};
