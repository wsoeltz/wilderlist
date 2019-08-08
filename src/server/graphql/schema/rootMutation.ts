import {
  GraphQLObjectType,
} from 'graphql';
import mongoose from 'mongoose';
import mountainMutations from './mutations/mountainMutations';
import peakListMutations from './mutations/peakListMutations';
import regionMutations from './mutations/regionMutations';
import stateMutations from './mutations/stateMutations';

mongoose.set('useFindAndModify', false);

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...regionMutations,
    ...stateMutations,
    ...mountainMutations,
    ...peakListMutations,
  },
});

export default mutation;
