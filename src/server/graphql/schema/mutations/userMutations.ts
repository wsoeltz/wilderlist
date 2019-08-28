/* tslint:disable:await-promise */
import {
  GraphQLID,
  GraphQLNonNull,
} from 'graphql';
import { PeakList } from '../queryTypes/peakListType';
// import { removeConnections } from '../../Utils';
import UserType, { User } from '../queryTypes/userType';

const userMutations: any = {
  addPeakListToUser: {
    type: UserType,
    args: {
      userId: { type: GraphQLNonNull(GraphQLID) },
      peakListId: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, {userId, peakListId}: {userId: string, peakListId: string}) {
      try {
        const user = await User.findById(userId);
        const peakList = await PeakList.findById(peakListId);
        if (user !== null && peakList !== null) {
          // users resolves to a User object, but here we are just looking at the string ids
          const users: any[] = peakList.users;
          const numUsers = users.includes(userId) ? peakList.numUsers : users.length + 1;
          await PeakList.findOneAndUpdate({
              _id: peakListId,
              users: { $ne: userId },
            },
            { $push: {users: userId}, $set: {numUsers} },
            function(err: any, model: any) {
              if (err) {
                console.error(err);
              }
            },
          );
          await User.findOneAndUpdate({
              _id: userId,
              peakLists: { $ne: peakListId },
            },
            { $push: {peakLists: peakListId} },
            function(err: any, model: any) {
              if (err) {
                console.error(err);
              }
            },
          );
          return User.findById(userId);
        }
      } catch (err) {
        return err;
      }
    },
  },
  removePeakListFromUser: {
    type: UserType,
    args: {
      userId: { type: GraphQLNonNull(GraphQLID) },
      peakListId: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, {userId, peakListId}: {userId: string, peakListId: string}) {
      try {
        const user = await User.findById(userId);
        const peakList = await PeakList.findById(peakListId);
        if (user !== null && peakList !== null) {
          // users resolves to a User object, but here we are just looking at the string ids
          const users: any[] = peakList.users;
          const numUsers = users.includes(userId) ? users.length - 1 : peakList.numUsers;
          await PeakList.findOneAndUpdate({
              _id: peakListId,
            },
            { $pull: {users: userId}, $set: {numUsers} },
            function(err: any, model: any) {
              if (err) {
                console.error(err);
              }
            },
          );
          await User.findOneAndUpdate({
              _id: userId,
            },
            { $pull: {peakLists: peakListId} },
            function(err: any, model: any) {
              if (err) {
                console.error(err);
              }
            },
          );
          return User.findById(userId);
        }
      } catch (err) {
        return err;
      }
    },
  },
};

export default userMutations;
