const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String
    bookCount: Int
    savedBooks: [Book]
  }
  type Book {
    bookId: ID!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }
  type Auth {
    token: ID!
    user: User
  }
  input BookInput {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }
  type Query {
    user: User
  }
  type Mutation {
    newUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    save(bookData: BookInput!): User
    remove(bookId: ID!): User
  }
`;

module.exports = typeDefs;