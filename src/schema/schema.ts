const graphql = require('graphql');
import { find } from 'lodash';

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
} = graphql;

const users = [
  {id: '1', firstName: 'Kyle', age: 27},
  {id: '2', firstName: 'Jessie', age: 26},
];

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type:  GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parentValue: any, args: any) {
        return find(users, { id: args.id });
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
});
