import { GraphQLSchema } from 'graphql';

import mutations from './rootMutation';
import RootQueryType from './rootQueryType';

export default new GraphQLSchema({
  query: RootQueryType,
  mutation: mutations,
});
