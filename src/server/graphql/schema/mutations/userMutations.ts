/* tslint:disable:await-promise */
import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { FriendStatus } from '../../graphQLTypes';
import { PeakList } from '../queryTypes/peakListType';
import UserType, { User } from '../queryTypes/userType';

interface CompletedMountainMutationArgs {
  userId: string;
  mountainId: string;
  date: string;
}

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
  addMountainCompletion: {
    type: UserType,
    args: {
      userId: { type: GraphQLNonNull(GraphQLID) },
      mountainId: { type: GraphQLNonNull(GraphQLID) },
      date: { type: GraphQLNonNull(GraphQLString) },
    },
    async resolve(_unused: any, args: CompletedMountainMutationArgs) {
      const { userId, mountainId, date } = args;
      await User.findOneAndUpdate({
        '_id': userId,
        'mountains.mountain': { $ne: mountainId },
      }, {
        $addToSet: { mountains: {mountain: mountainId} },
      });
      await User.findOneAndUpdate({
        '_id': userId,
        'mountains.mountain': mountainId,
      }, {
        $addToSet: { 'mountains.$.dates': date },
      });
      return await User.findOne({_id: userId});
    },
  },
  removeMountainCompletion: {
    type: UserType,
    args: {
      userId: { type: GraphQLNonNull(GraphQLID) },
      mountainId: { type: GraphQLNonNull(GraphQLID) },
      date: { type: GraphQLNonNull(GraphQLString) },
    },
    async resolve(_unused: any, args: CompletedMountainMutationArgs) {
      const { userId, mountainId, date } = args;
      await User.findOneAndUpdate({
        '_id': userId,
        'mountains.mountain': { $ne: mountainId },
      }, {
        $addToSet: { mountains: {mountain: mountainId} },
      });
      await User.findOneAndUpdate({
        '_id': userId,
        'mountains.mountain': mountainId,
      }, {
        $pull: { 'mountains.$.dates': date },
      });
      return await User.findOne({_id: userId});
    },
  },
  sendFriendRequest: {
  //   create new 'friend' document in both users with respective ids
  //   assign status of 'sent' and 'recieved' to respective users
    type: UserType,
    args: {
      userId: { type: GraphQLNonNull(GraphQLID) },
      friendId: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, {userId, friendId}: {userId: string, friendId: string} ) {
      try {
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);
        if (user !== null && friend !== null) {
          await User.findOneAndUpdate({
            '_id': userId,
            'friends.user': { $ne: friendId },
          }, {
            $addToSet: { friends: {
              user: friendId,
              status: FriendStatus.sent,
            } },
          });
          await User.findOneAndUpdate({
            '_id': friendId,
            'friends.user': { $ne: userId },
          }, {
            $addToSet: { friends: {
              user: userId,
              status: FriendStatus.recieved,
            } },
          });
          return User.findById(userId);
        }
      } catch (err) {
        return err;
      }
    },
  },
  acceptFriendRequest: {
  //   change status on both users 'friend' document to 'friends'
    type: UserType,
    args: {
      userId: { type: GraphQLNonNull(GraphQLID) },
      friendId: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, {userId, friendId}: {userId: string, friendId: string} ) {
      try {
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);
        if (user !== null && friend !== null) {
          await User.findOneAndUpdate({
            '_id': userId,
            'friends.user': friendId,
          },
           {
            $set: { 'friends.$.status': FriendStatus.friends },
          });
          await User.findOneAndUpdate({
            '_id': friendId,
            'friends.user': userId,
          }, {
            $set: { 'friends.$.status': FriendStatus.friends },
          });
          return User.findById(userId);
        }
      } catch (err) {
        return err;
      }
    },
  },
  removeFriend: {
    //   remove 'friend' document from both users
    //   will also be used for declining a friend request
    type: UserType,
    args: {
      userId: { type: GraphQLNonNull(GraphQLID) },
      friendId: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, {userId, friendId}: {userId: string, friendId: string}) {
      await User.findOneAndUpdate({
        '_id': userId,
        'friends.user': friendId,
      }, {
        $pull: { friends: { user: friendId } },
      });
      await User.findOneAndUpdate({
        '_id': friendId,
        'friends.user': userId,
      }, {
        $pull: { friends: { user: userId } },
      });
      return await User.findOne({_id: userId});
    },

  },
};

export default userMutations;
