import {
  GraphQLObjectType,
} from 'graphql';
import mongoose from 'mongoose';
import mountainMutations from './mutations/mountainMutations';
import peakListMutations from './mutations/peakListMutations';
import regionMutations from './mutations/regionMutations';
import stateMutations from './mutations/stateMutations';
import tripReportMutations from './mutations/tripReportMutations';
import userMutations from './mutations/userMutations';

mongoose.set('useFindAndModify', false);

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...regionMutations,
    ...stateMutations,
    ...mountainMutations,
    ...peakListMutations,
    ...userMutations,
    ...tripReportMutations,
  },
});

export default mutation;
