import {
  GraphQLObjectType,
} from 'graphql';
import mongoose from 'mongoose';
import campsiteMutations from './mutations/campsiteMutations';
import mountainMutations from './mutations/mountainMutations';
import peakListMutations from './mutations/peakListMutations';
import regionMutations from './mutations/regionMutations';
import stateMutations from './mutations/stateMutations';
import trailMutations from './mutations/trailMutations';
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
    ...trailMutations,
    ...campsiteMutations,
  },
});

export default mutation;
