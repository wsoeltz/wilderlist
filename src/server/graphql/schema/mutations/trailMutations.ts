/* tslint:disable:await-promise */
import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { isAdmin, isLoggedIn } from '../../authorization';
import {
  User as IUser,
} from '../../graphQLTypes';
import { removeConnections } from '../../Utils';
import { PeakList } from '../queryTypes/peakListType';
import TrailType, {
  Trail,
} from '../queryTypes/trailType';

const trailMutations: any = {
  deleteTrail: {
    type: TrailType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, { id }: { id: string }, {user}: {user: IUser | undefined | null}) {
      if (!isAdmin(user)) {
        throw new Error('Invalid permission');
      }
      try {
        await removeConnections(Trail, id, 'lists', PeakList, 'trails');
        return Trail.findByIdAndDelete(id);
      } catch (err) {
        return err;
      }
    },
  },
  updateTrailFlag: {
    type: TrailType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      flag: { type: GraphQLString },
    },
    async resolve(_unused: any,
                  { id, flag }: { id: string , flag: string | null},
                  {dataloaders, user}: {dataloaders: any, user: IUser | undefined | null}) {
      if (!isLoggedIn(user)) {
        throw new Error('You must be logged in');
      }
      try {
        const trail = await Trail.findOneAndUpdate(
        { _id: id },
        { flag },
        {new: true});
        dataloaders.trailLoader.clear(id).prime(id, trail);
        return trail;
      } catch (err) {
        return err;
      }
    },
  },
};

export default trailMutations;
