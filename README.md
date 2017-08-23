### Getting started

```
git clone git@gitlab.intra.wepiao.com:FEI/Thor.git
cd Thor
yarn
```

### Run

```
npm run dev
```

graphiql: http://localhost:3000/graphiql

# Two example GraphQL query （use schema2 in src/server.js） might look like:
```
{
  posts {
    title
    votes
    author {
      firstName
    }
  }
}

# or

mutation Mutation {
  upvotePost(postId:1) {
    id,votes
  }
}
```

# Two example GraphQL query (use schema in src/server.js) connect Mongo

```
mutation firstMutation{
  UserCreate(data: {firstName: "John", lastName: "Dohe"})
}
mutation secondMutation{
  UserCreate(data: {firstName: "Jane", lastName: "Dohe"})
}

# or

{
  "data": {
    "UserCreate": true
  }
}
```