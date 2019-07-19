import { GraphQLSchema } from 'graphql';

import RootQueryType from './rootQueryType';
// import mutations from './mutations';

export default new GraphQLSchema({
  query: RootQueryType,
  // mutation: mutations,
});
