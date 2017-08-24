// This example demonstrates a simple server with some
// relational data: Posts and Authors. You can get the
// posts for a particular author, and vice-versa

// Read the complete docs for graphql-tools here:
// http://dev.apollodata.com/tools/graphql-tools/generate-schema.html

import { find, filter } from 'lodash';

import { makeExecutableSchema } from 'graphql-tools';

const typeDefs = `
  type Author {
    id: Int!
    firstName: String
    lastName: String
    posts: [Post] # the list of Posts by this author
  }

  type Post {
    id: Int!
    title: String
    author: Author
    votes: Int
  }

  # the schema allows the following query:
  type Query {
    posts(time: Int): [Post]
    author(id: Int!): Author
  }

  # this schema allows the following mutation:
  type Mutation {
    upvotePost (
      postId: Int!
    ): Post
  }
`;

const authors = [
  { id: 1, firstName: 'Tom', lastName: 'Coleman' },
  { id: 2, firstName: 'Sashko', lastName: 'Stubailo' },
  { id: 3, firstName: 'Mikhail', lastName: 'Novikov' }
];

const posts = [
  { id: 1, authorId: 1, title: 'Introduction to GraphQL', votes: 2 },
  { id: 2, authorId: 2, title: 'Welcome to Meteor', votes: 3 },
  { id: 3, authorId: 2, title: 'Advanced GraphQL', votes: 1 },
  { id: 4, authorId: 3, title: 'Launchpad is Cool', votes: 7 }
];

const getPosts = async () => {
  const p = await new Promise(resolve => {
    setTimeout(() => {
      console.log('posts', posts);
      resolve(posts);
    }, 1000);
  });
  return p;
};

const resolvers = {
  Query: {
    posts: async () => {
      const p = await getPosts();
      return p;
    },
    author: (_, { id }) => find(authors, { id })
  },
  Mutation: {
    upvotePost: (_, { postId }) => {
      console.log(_);
      const post = find(posts, { id: postId });
      if (!post) {
        throw new Error(`Couldn't find post with id ${postId}`);
      }
      post.votes += 1;
      return post;
    }
  },
  Author: {
    posts: author => filter(posts, { authorId: author.id })
  },
  Post: {
    author: (post, time) => {
      console.log('post', post, 'time', time);

      return find(authors, { id: post.authorId });
    }
  }
};

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
