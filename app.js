const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");

const app = express();
app.use(express.json({ limit: "50mb" }));

const user = {
  name: "Apoorva Raj Bhadani",
  bio: "Software Engineer at Newzera",
  profilepic: "",
};

const story = {
  picture: "",
  text: "no story found",
};

const updateUserHandler = () => {
  user.name = "updatedFN newLN";
  user.bio = "updated bio";
};

// Schema
const typeDefs = gql`
  type User {
    name: String!
    bio: String!
    profilepic: String
  }

  type Story {
    picture: String
    text: String
  }

  type Query {
    User: User
    Story: Story
  }

  type Mutation {
    updateUser(name: String!, bio: String!): User!
    updateProfilePic(profilepic: String!): User
    updateStory(picture: String!, text: String!): Story!
    updateStoryTitle(text: String!): Story!
  }
`;

//Resolvers
const resolvers = {
  Query: {
    User: () => user,
    Story: () => story,
  },
  Mutation: {
    updateUser: (parent, args) => {
      console.log(`new name : ${args.name}, new bio : ${args.bio}`);
      user.name = args.name;
      user.bio = args.bio;
      return user;
    },
    updateProfilePic: async (parent, args) => {
      //console.log("client response: ", args);
      console.log("profile pic updated");
      user.profilepic = args.profilepic;
      return user;
    },
    updateStory: (parent, args) => {
      console.log("story picture updated");
      story.picture = args.picture;
    },
    updateStoryTitle: (parent, args) => {
      console.log("story title update : ", args.text);
      story.text = args.text;
    },
  },
};

let server = null;
async function startServer() {
  server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
  });
  await server.start();
  server.applyMiddleware({ app });
}
startServer();

const PORT = 4000;
app.listen({ port: PORT }, () => {
  console.log(`Server ready at localhost:${PORT}${server.graphqlPath}`);
});
