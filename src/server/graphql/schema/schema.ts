import { GraphQLSchema } from 'graphql';

import mutations from './mutations';
import RootQueryType from './rootQueryType';

export default new GraphQLSchema({
  query: RootQueryType,
  mutation: mutations,
});
