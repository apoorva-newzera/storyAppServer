const express = require("express");
const mysql = require("mysql2");
const { ApolloServer, gql } = require("apollo-server-express");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json());

var dbConnection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "@vengers",
  database: "story_db",
});
dbConnection.connect((err) => {
  if (err) throw err;
  console.log("DB Connected");
});

const user = {
  name: "Apoorva Raj Bhadani",
  bio: "Software Engineer at Newzera",
  profilepic: "",
};

const story = {
  picture: "",
  text: "no story found",
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
    User(id: Int!): User
    Story(id: Int!): Story
  }

  type Mutation {
    updateUser(id: Int!, name: String!, bio: String!): User!
    updateProfilePic(id: Int!, profilepic: String!): User
    updateStory(id: Int!, picture: String!, text: String!): Story!
    updateStoryTitle(id: Int!, text: String!): Story!
  }
`;

const queryUser = {
  name: "SQL query User Name",
  profilepic: "SQL query ProfilePic",
  bio: "SQL query Bio",
};
const queryStory = {
  picture: "SQL query picture",
  text: "SQL query story title",
};
//Resolvers
const resolvers = {
  Query: {
    User: (parent, args) => {
      try {
        let sqlQuery = `SELECT * FROM User WHERE ID=${args.id}`;
        dbConnection.query(sqlQuery, (err, results) => {
          if (err) throw err;
          //console.log("SQL query User");
          const data = apiResponse(results);
          queryUser.name = results[0].Name;
          queryUser.bio = results[0].Bio;
          queryUser.profilepic = results[0].ProfilePic;
        });
      } catch (err) {
        console.log(err);
      }
      return queryUser;
    },
    Story: (parent, args) => {
      try {
        let sqlQuery = `SELECT * FROM Story WHERE ID=${args.id}`; 
        dbConnection.query(sqlQuery, (err, results) => {
          if (err) throw err;
          //console.log("SQL query Story");
          const data = apiResponse(results);
          queryStory.picture = results[0].Picture;
          queryStory.text = results[0].Text;
        });
      } catch (err) {
        console.log(err);
      }
      return queryStory;
    },
    //User: () => user,
    //Story: () => story,
  },
  Mutation: {
    updateUser: (parent, args) => {
      // console.log(`new name : ${args.name}, new bio : ${args.bio}`);
      // user.name = args.name;
      // user.bio = args.bio;
      // return user;
      try {
        let sqlQuery = `UPDATE User SET Name = "${args.name}", Bio = "${args.bio}" WHERE ID=${args.id};`;
        dbConnection.query(sqlQuery, (err, results) => {
          if (err) throw err;
          const data = apiResponse(results);
          console.log("Update User", data);
        });
      } catch (err) {
        console.log(err);
      }
    },
    updateProfilePic: async (parent, args) => {
      //console.log("client response: ", args);
      //console.log("profile pic updated");
      //user.profilepic = args.profilepic;
      //return user;
      console.log(args);
      try {
        let sqlQuery = `UPDATE User SET ProfilePic = "${args.profilepic}" WHERE ID=${args.id};`;
        dbConnection.query(sqlQuery, (err, results) => {
          if (err) throw err;
          const data = apiResponse(results);
          console.log("Update Profile Pic", data);
        });
      } catch (err) {
        console.log(err);
      }
    },
    updateStory: (parent, args) => {
      // console.log("story picture updated");
      // story.picture = args.picture;
      try {
        let sqlQuery = `UPDATE Story SET Picture = "${args.picture}" WHERE ID=${args.id};`;
        dbConnection.query(sqlQuery, (err, results) => {
          if (err) throw err;
          const data = apiResponse(results);
          console.log("Update Story Picture", data);
        });
      } catch (err) {
        console.log(err);
      }
    },
    updateStoryTitle: (parent, args) => {
      // console.log("story title update : ", args.text);
      // story.text = args.text;
      try {
        let sqlQuery = `UPDATE Story SET Text = "${args.text}" WHERE ID=${args.id};`;
        dbConnection.query(sqlQuery, (err, results) => {
          if (err) throw err;
          const data = apiResponse(results);
          console.log("Update Story Title", data);
        });
      } catch (err) {
        console.log(err);
      }
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

app.get("/api/users", (req, res) => {
  let sqlQuery = "SELECT * FROM User";
  let query = dbConnection.query(sqlQuery, (err, results) => {
    if (err) throw err;
    const data = apiResponse(results);
    res.send(data);
  });
});

app.get("/api/storys", (req, res) => {
  let sqlQuery = "SELECT * FROM Story";
  let query = dbConnection.query(sqlQuery, (err, results) => {
    if (err) throw err;
    const data = apiResponse(results);
    res.send(data);
  });
});

function apiResponse(results) {
  return JSON.stringify({ status: 200, error: null, response: results });
}
const PORT = 4000;
app.listen({ port: PORT }, () => {
  console.log(`Server ready at localhost:${PORT}${server.graphqlPath}`);
});
