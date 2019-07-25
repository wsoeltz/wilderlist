import {
  GraphQLObjectType,
} from 'graphql';
import mongoose from 'mongoose';
import listMutations from './mutations/listMutations';
import mountainMutations from './mutations/mountainMutations';
import regionMutations from './mutations/regionMutations';
import stateMutations from './mutations/stateMutations';

mongoose.set('useFindAndModify', false);

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...regionMutations,
    ...stateMutations,
    ...mountainMutations,
    ...listMutations,
  },
});

export default mutation;
