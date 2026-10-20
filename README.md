# Social Media

A learning project focused on building a social media app with MongoDB, Express, React, Node.js, and GraphQL (the MERNG stack).

A simple web app where users can register, create posts, and interact with other users' posts through likes and comments. The goal is to learn how these technologies work together in a full-stack application.

## What I built

- User registration and login with input validation, bcrypt password hashing, and JWT authentication.
- Persistent login state using React Context and local storage, with authenticated requests through Apollo Client.
- A recent-posts feed and individual post pages, with the ability to create, edit, and delete my own posts.
- Like/unlike interactions, comment creation and deletion, and avatar selection during registration.
- Server-side ownership checks so users can only edit or delete their own content.
- Reusable React components and form logic, client-side routing, and dedicated CSS files.
- Delete confirmations, tooltips, loading states, error feedback, keyboard shortcuts, and draft preservation when edits or comments fail to save.

## What I learned

The main takeaway was learning to build a feature end to end: a user interacts with React, Apollo Client sends a GraphQL operation, a server resolver validates the request and checks permissions, Mongoose reads or writes MongoDB, and the result updates the interface.

Along the way, I learned how GraphQL schemas and resolvers work together, how to model referenced and embedded data, and why authentication (who a user is) differs from authorization (what they can change). I also learned to separate local UI state, shared authentication state, and cached server data, using both query refetching and Apollo's normalized cache to keep views in sync.

Beyond the happy path, I practiced handling loading, failure, retry, cancellation, and accidental actions. Building in small steps, fixing bugs, and refactoring helped turn individual features into a connected application.

## Running the app

Start the backend from the repository root:

```sh
npm run serve
```

In a separate terminal, start the frontend:

```sh
cd client
npm run start
```
