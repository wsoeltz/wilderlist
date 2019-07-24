import {
  GraphQLObjectType,
} from 'graphql';
import mongoose from 'mongoose';
import regionMutations from './mutations/regionMutations';
import stateMutations from './mutations/stateMutations';

mongoose.set('useFindAndModify', false);

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...regionMutations,
    ...stateMutations,
  },
});

export default mutation;
