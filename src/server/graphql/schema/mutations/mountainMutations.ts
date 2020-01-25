/* tslint:disable:await-promise */
import {
  GraphQLFloat,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import {
  CreatedItemStatus as CreatedItemStatusEnum,
  Mountain as IMountain,
  MountainFlag as MountainFlagEnum,
  PermissionTypes,
  User as IUser,
} from '../../graphQLTypes';
import { removeConnections } from '../../Utils';
import MountainType, {
  CreatedItemStatus,
  Mountain,
  MountainFlag,
} from '../queryTypes/mountainType';
import { PeakList } from '../queryTypes/peakListType';
import { State } from '../queryTypes/stateType';
import { User } from '../queryTypes/userType';
import { isCorrectUser, isAdmin, isLoggedIn } from '../../authorization';

const mountainMutations: any = {
  addMountain: {
    type: MountainType,
    args: {
      name: { type: GraphQLNonNull(GraphQLString) },
      latitude: { type: GraphQLNonNull(GraphQLFloat) },
      longitude: { type: GraphQLNonNull(GraphQLFloat) },
      elevation: { type: GraphQLNonNull(GraphQLFloat) },
      prominence: { type: GraphQLFloat },
      state: { type: GraphQLID },
      lists: { type: new GraphQLList(GraphQLID)},
      author: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, input: IMountain, {user}: {user: IUser | undefined | null}) {
      const {
        name, state, lists, latitude, longitude, elevation,
        prominence, author,
      } = input;
      const authorObj = await User.findById(author);
      if (!isCorrectUser(user, authorObj)) {
        throw new Error('Invalid user match')
      }
      let status: CreatedItemStatusEnum | null;
      if (!authorObj) {
        status = null;
      } else if ( (authorObj.mountainPermissions !== null &&
            authorObj.mountainPermissions > 5 ) ||
        authorObj.permissions === PermissionTypes.admin) {
        status = CreatedItemStatusEnum.auto;
      } else if (authorObj.mountainPermissions !== null &&
            authorObj.mountainPermissions === -1) {
        return null;
      } else {
        status = CreatedItemStatusEnum.pending;
      }
      const newMountain = new Mountain({
        name, state, lists, latitude, longitude, elevation, prominence, author, status,
      });
      try {
        if ( name !== '') {
          if (lists !== undefined) {
            lists.forEach(async (id) => {
              await PeakList.findOneAndUpdate(
                { _id: id, mountains: { $ne: newMountain.id} },
                { $push: {mountains: newMountain.id} },
                function(err: any, model: any) {
                  if (err) {
                    console.error(err);
                  }
                },
              );
            });
          }
          await State.findByIdAndUpdate(state,
            { $push: {mountains: newMountain.id} });
        }
        return newMountain.save();
      } catch (err) {
        return err;
      }
    },
  },
  deleteMountain: {
    type: MountainType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, { id }: { id: string }, {user}: {user: IUser | undefined | null}) {
      if (!isAdmin(user)) {
        throw new Error('Invalid permission')
      }
      try {
        await State.findOneAndUpdate({ mountains: { $eq: id } },
          { $pull: {mountains: id} }, function(err: any, model: any) {
            if (err) { console.error(err); } } );
        await removeConnections(Mountain, id, 'lists', PeakList, 'mountains');
        return Mountain.findByIdAndDelete(id);
      } catch (err) {
        return err;
      }
    },
  },
  addMountainToState: {
    type: MountainType,
    args: {
      mountainId: { type: GraphQLNonNull(GraphQLID) },
      stateId: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, {mountainId, stateId}: {mountainId: string, stateId: string},
      {user}: {user: IUser | undefined | null}) {
      if (!isAdmin(user)) {
        throw new Error('Invalid permission')
      }
      try {
        const mountain = await Mountain.findById(mountainId);
        const state = await State.findById(stateId);
        if (mountain !== null && state !== null) {
          await State.findOneAndUpdate({
              mountains: { $eq: mountainId },
            },
            { $pull: {mountains: mountainId} },
            function(err: any, model: any) {
              if (err) {
                console.error(err);
              }
            },
          );
          await State.findOneAndUpdate({
              _id: stateId,
              mountains: { $ne: mountainId },
            },
            { $push: {mountains: mountainId} },
            function(err: any, model: any) {
              if (err) {
                console.error(err);
              }
            },
          );
          await Mountain.findOneAndUpdate({
              _id: mountainId,
            },
            { state: stateId },
            function(err: any, model: any) {
              if (err) {
                console.error(err);
              }
            },
          );
          return mountain;
        }
      } catch (error) {
        return error;
      }
    },
  },
  updateMountain: {
    type: MountainType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLNonNull(GraphQLString) },
      latitude: { type: GraphQLNonNull(GraphQLFloat) },
      longitude: { type: GraphQLNonNull(GraphQLFloat) },
      elevation: { type: GraphQLNonNull(GraphQLFloat) },
      prominence: { type: GraphQLFloat },
      state: { type: GraphQLID },
    },
    async resolve(_unused: any, input: IMountain, {user}: {user: IUser | undefined | null}) {
      const { id, name, state: stateId, latitude, longitude, elevation, prominence } = input;
      try {
        const mountain = await Mountain.findById(id);
        const authorObj = mountain && mountain.author ? mountain.author : null;
        if (!(isCorrectUser(user, authorObj) || isAdmin(user))) {
          throw new Error('Invalid user match')
        }
        const state = await State.findById(stateId);
        if (mountain !== null && state !== null) {
          await State.findOneAndUpdate({
              mountains: { $eq: id },
            },
            { $pull: {mountains: id} },
            function(err: any, model: any) {
              if (err) {
                console.error(err);
              }
            },
          );
          await State.findOneAndUpdate({
              _id: stateId,
              mountains: { $ne: id },
            },
            { $push: {mountains: id} },
            function(err: any, model: any) {
              if (err) {
                console.error(err);
              }
            },
          );
          const fields = prominence !== undefined ? { name, state: stateId, latitude, longitude, elevation, prominence }
            : { name, state: stateId, latitude, longitude, elevation };
          const newMountain = await Mountain.findOneAndUpdate({
              _id: id,
            },
            { ...fields },
            {new: true});
          return newMountain;
        } else if (mountain !== null) {
          const fields = prominence !== undefined ? { name, latitude, longitude, elevation, prominence }
            : { name, latitude, longitude, elevation };
          const newMountain = await Mountain.findOneAndUpdate({
              _id: id,
            },
            { ...fields },
            {new: true});
          return newMountain;
        }
      } catch (err) {
        return err;
      }
    },
  },
  updateMountainStatus: {
    type: MountainType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      status: { type: CreatedItemStatus },
    },
    async resolve(_unused: any,
                  { id, status }: { id: string , status: CreatedItemStatusEnum | null},
                  {dataloaders, user}: {dataloaders: any, user: IUser | undefined | null}) {
      if (!isAdmin(user)) {
        throw new Error('Invalid permission')
      }
      try {
        const mountain = await Mountain.findOneAndUpdate(
        { _id: id },
        { status },
        {new: true});
        dataloaders.mountainLoader.clear(id).prime(id, mountain);
        return mountain;
      } catch (err) {
        return err;
      }
    },
  },
  updateMountainFlag: {
    type: MountainType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      flag: { type: MountainFlag },
    },
    async resolve(_unused: any,
                  { id, flag }: { id: string , flag: MountainFlagEnum | null},
                  {dataloaders, user}: {dataloaders: any, user: IUser | undefined | null}) {
      if (!isLoggedIn(user)) {
        throw new Error('You must be logged in')
      }
      try {
        const mountain = await Mountain.findOneAndUpdate(
        { _id: id },
        { flag },
        {new: true});
        dataloaders.mountainLoader.clear(id).prime(id, mountain);
        return mountain;
      } catch (err) {
        return err;
      }
    },
  },
};

export default mountainMutations;
