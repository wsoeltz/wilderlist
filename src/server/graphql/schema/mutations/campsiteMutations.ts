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
import CampsiteType, {
  Campsite,
} from '../queryTypes/campsiteType';
import { PeakList } from '../queryTypes/peakListType';

const campsiteMutations: any = {
  deleteCampsite: {
    type: CampsiteType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, { id }: { id: string }, {user}: {user: IUser | undefined | null}) {
      if (!isAdmin(user)) {
        throw new Error('Invalid permission');
      }
      try {
        await removeConnections(Campsite, id, 'lists', PeakList, 'campsites');
        return Campsite.findByIdAndDelete(id);
      } catch (err) {
        return err;
      }
    },
  },
  updateCampsiteFlag: {
    type: CampsiteType,
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
        const campsite = await Campsite.findOneAndUpdate(
        { _id: id },
        { flag },
        {new: true});
        dataloaders.campsiteLoader.clear(id).prime(id, campsite);
        return campsite;
      } catch (err) {
        return err;
      }
    },
  },
};

export default campsiteMutations;
