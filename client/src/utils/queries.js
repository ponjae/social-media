import gql from "graphql-tag";

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      avatar
      likes {
        username
      }
      comments {
        id
        body
        username
        createdAt
      }
    }
  }
`;

export const FETCH_POST_QUERY = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      avatar
      likes {
        username
      }
      comments {
        id
        body
        username
        createdAt
      }
    }
  }
`;
