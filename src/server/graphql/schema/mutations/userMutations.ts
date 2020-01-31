/* tslint:disable:await-promise */
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import {
  sendAcceptFriendRequestEmailNotification,
  sendAscentEmailNotification,
  sendFriendRequestEmailNotification,
} from '../../../notifications/email';
import { isAdmin, isCorrectUser, isLoggedIn } from '../../authorization';
import { FriendStatus, User as IUser } from '../../graphQLTypes';
import { asyncForEach, formatStringDate } from '../../Utils';
import { Mountain } from '../queryTypes/mountainType';
import { PeakList } from '../queryTypes/peakListType';
import UserType, { User } from '../queryTypes/userType';

interface CompletedMountainMutationArgs {
  userId: string;
  mountainId: string;
  date: string;
}
interface AscentNotificationMutationArgs {
  userId: string;
  friendId: string;
  mountainIds: string[];
  date: string;
}
interface PeakListNoteMutationArgs {
  userId: string;
  peakListId: string;
  text: string;
}
interface MountainNoteMutationArgs {
  userId: string;
  mountainId: string;
  text: string;
}

const userMutations: any = {
  addPeakListToUser: {
    type: UserType,
    args: {
      userId: { type: GraphQLNonNull(GraphQLID) },
      peakListId: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, {userId, peakListId}: {userId: string, peakListId: string},
                  context: {user: IUser | undefined | null}) {
      try {
        const user = await User.findById(userId);
        if (!isCorrectUser(user, context.user)) {
          throw new Error('Invalid user match');
        }
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
    async resolve(_unused: any, {userId, peakListId}: {userId: string, peakListId: string},
                  context: {user: IUser | undefined | null}) {
      try {
        const user = await User.findById(userId);
        if (!isCorrectUser(user, context.user)) {
          throw new Error('Invalid user match');
        }
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
    async resolve(_unused: any, args: CompletedMountainMutationArgs,
                  context: {user: IUser | undefined | null}) {
      const { userId, mountainId, date } = args;
      try {
        const user = await User.findById(userId);
        if (!isCorrectUser(user, context.user)) {
          throw new Error('Invalid user match');
        }
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
      } catch (err) {
        return err;
      }
    },
  },
  removeMountainCompletion: {
    type: UserType,
    args: {
      userId: { type: GraphQLNonNull(GraphQLID) },
      mountainId: { type: GraphQLNonNull(GraphQLID) },
      date: { type: GraphQLNonNull(GraphQLString) },
    },
    async resolve(_unused: any, args: CompletedMountainMutationArgs,
                  context: {user: IUser | undefined | null}) {
      const { userId, mountainId, date } = args;
      try {
        const user = await User.findById(userId);
        if (!isCorrectUser(user, context.user)) {
          throw new Error('Invalid user match');
        }
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
      } catch (err) {
        return err;
      }
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
    async resolve(_unused: any, {userId, friendId}: {userId: string, friendId: string},
                  context: {user: IUser | undefined | null} ) {
      try {
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);
        if (!(isCorrectUser(user, context.user) || isCorrectUser(friend, context.user))) {
          throw new Error('Invalid user match');
        }
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
          if (friend.email) {
            sendFriendRequestEmailNotification({
              userName: user.name,
              userEmail: friend.email,
            });
          }
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
    async resolve(_unused: any, {userId, friendId}: {userId: string, friendId: string},
                  context: {user: IUser | undefined | null} ) {
      try {
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);
        if (!(isCorrectUser(user, context.user) || isCorrectUser(friend, context.user))) {
          throw new Error('Invalid user match');
        }
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
          if (friend.email) {
            await sendAcceptFriendRequestEmailNotification({
              userId,
              userName: user.name,
              userEmail: friend.email,
            });
          }
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
    async resolve(_unused: any, {userId, friendId}: {userId: string, friendId: string},
                  context: {user: IUser | undefined | null} ) {
      try {
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);
        if (!(isCorrectUser(user, context.user) || isCorrectUser(friend, context.user))) {
          throw new Error('Invalid user match');
        }
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
      } catch (err) {
        return err;
      }
    },

  },

  deleteUser: {
    type: UserType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, { id }: { id: string }, context: {user: IUser | undefined | null}) {
      if (!isAdmin(context.user)) {
        throw new Error('Invalid permission');
      }
      try {
        const user = await User.findById(id);
        if (user !== null) {
          try {
            if (user.peakLists !== null && user.peakLists.length > 0) {
              throw new Error('You must remove all peakLists');
            }
            if (user.friends !== null && user.friends.length > 0) {
              throw new Error('You must remove all friends');
            }
            return User.findByIdAndDelete(id);
          } catch (err) {
            return err;
          }
        }
      } catch (err) {
        return err;
      }
    },
  },
  updateEmail: {
    type: UserType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      value: { type: GraphQLNonNull(GraphQLString) },
    },
    async resolve(_unused: any,
                  { id, value }: { id: string , value: string},
                  context: {dataloaders: any, user: IUser | undefined | null}) {
      try {
        const user = await User.findById(id);
        if (!isCorrectUser(user, context.user)) {
          throw new Error('Invalid user match');
        }
        const updatedUser = await User.findOneAndUpdate({
          _id: id,
        },
        { email: value },
        {new: true});
        context.dataloaders.userLoader.clear(id).prime(id, updatedUser);
        return updatedUser;
      } catch (err) {
        return err;
      }
    },
  },
  setHideEmail: {
    type: UserType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      value: { type: GraphQLNonNull(GraphQLBoolean) },
    },
    async resolve(_unused: any,
                  { id, value }: { id: string , value: boolean},
                  context: {dataloaders: any, user: IUser | undefined | null}) {
      try {
        const user = await User.findById(id);
        if (!isCorrectUser(user, context.user)) {
          throw new Error('Invalid user match');
        }
        const updatedUser = await User.findOneAndUpdate({
          _id: id,
        },
        { hideEmail: value },
        {new: true});
        context.dataloaders.userLoader.clear(id).prime(id, updatedUser);
        return user;
      } catch (err) {
        return err;
      }
    },
  },
  setHideProfilePicture: {
    type: UserType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      value: { type: GraphQLNonNull(GraphQLBoolean) },
    },
    async resolve(_unused: any,
                  { id, value }: { id: string , value: boolean},
                  context: {dataloaders: any, user: IUser | undefined | null}) {
      try {
        const user = await User.findById(id);
        if (!isCorrectUser(user, context.user)) {
          throw new Error('Invalid user match');
        }
        const updatedUser = await User.findOneAndUpdate({
          _id: id,
        },
        { hideProfilePicture: value },
        {new: true});
        context.dataloaders.userLoader.clear(id).prime(id, updatedUser);
        return updatedUser;
      } catch (err) {
        return err;
      }
    },
  },
  setHideProfileInSearchResults: {
    type: UserType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      value: { type: GraphQLNonNull(GraphQLBoolean) },
    },
    async resolve(_unused: any,
                  { id, value }: { id: string , value: boolean},
                  context: {dataloaders: any, user: IUser | undefined | null}) {
      try {
        const user = await User.findById(id);
        if (!isCorrectUser(user, context.user)) {
          throw new Error('Invalid user match');
        }
        const updatedUser = await User.findOneAndUpdate({
          _id: id,
        },
        { hideProfileInSearch: value },
        {new: true});
        context.dataloaders.userLoader.clear(id).prime(id, updatedUser);
        return updatedUser;
      } catch (err) {
        return err;
      }
    },
  },
  setDisableEmailNotifications: {
    type: UserType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      value: { type: GraphQLNonNull(GraphQLBoolean) },
    },
    async resolve(_unused: any,
                  { id, value }: { id: string , value: boolean},
                  context: {dataloaders: any, user: IUser | undefined | null}) {
      try {
        const user = await User.findById(id);
        if (!isCorrectUser(user, context.user)) {
          throw new Error('Invalid user match');
        }
        const updatedUser = await User.findOneAndUpdate({
          _id: id,
        },
        { disableEmailNotifications: value },
        {new: true});
        context.dataloaders.userLoader.clear(id).prime(id, updatedUser);
        return updatedUser;
      } catch (err) {
        return err;
      }
    },
  },
  addAscentNotifications: {
    type: UserType,
    args: {
      userId: { type: GraphQLNonNull(GraphQLID) },
      friendId: { type: GraphQLNonNull(GraphQLID) },
      mountainIds: { type: new GraphQLList(GraphQLID)},
      date: { type: GraphQLNonNull(GraphQLString) },
    },
    async resolve(_unused: any, args: AscentNotificationMutationArgs,
                  context: {user: IUser | undefined | null}) {
      const { userId, friendId, mountainIds, date } = args;
      try {
        if (!isLoggedIn(context.user)) {
          throw new Error('You must be logged in');
        }
        const friend = await User.findOne({ _id: friendId });
        const mountainList: string[] = [];
        await asyncForEach(mountainIds, async (mountainId: string) => {
          if (friend) {
            const completedMountain = friend && friend.mountains ?
              friend.mountains.find((mtn: any) => {
                return (mtn.mountain.toString() === mountainId);
              }) : undefined;
            const dateAlreadyExists = completedMountain
              ? completedMountain.dates.find(d => d === date) : undefined;
            if (!dateAlreadyExists) {
              await User.findOneAndUpdate({
                _id: friendId,
                $or: [
                  {'ascentNotifications.user': { $ne: userId }},
                  {'ascentNotifications.mountain': { $ne: mountainId }},
                  {'ascentNotifications.date': { $ne: date }},
                ],
              }, {
                $push: { ascentNotifications: {
                  user: userId, mountain: mountainId, date,
                } },
              });
              const mountain = await Mountain.findOne({_id: mountainId});
              if (mountain) {
                mountainList.push(mountain.name);
              }
            }
          }
        });
        const me = await User.findOne({_id: userId});
        if (me && friend && mountainList.length &&
            !friend.disableEmailNotifications && friend.email) {
          let mountainNames: string;
          if (mountainList.length === 1) {
            mountainNames = mountainList[0];
          } else if (mountainList.length === 2) {
            mountainNames = `${mountainList[0]} and ${mountainList[1]}`;
          } else {
            mountainNames = '';
            mountainList.forEach((mtn, i) => {
              if (i === mountainList.length - 2) {
                mountainNames += mtn + ' and ';
              } else if (i === mountainList.length - 1) {
                mountainNames += mtn;
              } else {
                mountainNames += mtn + ', ';
              }
            });
          }
          sendAscentEmailNotification({
            mountainName: mountainNames,
            user: me.name,
            userEmail: friend.email,
            date: formatStringDate(date),
          });
        }
        return await User.findOne({_id: friendId});
      } catch (err) {
        return err;
      }
    },
  },
  clearAscentNotification: {
    type: UserType,
    args: {
      userId: { type: GraphQLNonNull(GraphQLID) },
      mountainId: { type: GraphQLID },
      date: { type: GraphQLNonNull(GraphQLString) },
    },
    async resolve(_unused: any,
                  {userId, mountainId, date}: {userId: string, mountainId: string, date: string},
                  context: {user: IUser | undefined | null}) {
      if (!isLoggedIn(context.user)) {
        throw new Error('You must be logged in');
      }
      try {
        if (mountainId) {
          await User.findOneAndUpdate({ _id: userId },
            {$pull: { ascentNotifications: { mountain: mountainId, date } }},
          );
        } else {
          await User.findOneAndUpdate({ _id: userId },
            {$pull: { ascentNotifications: { date } }},
          );
        }
        return await User.findOne({_id: userId});
      } catch (err) {
        return err;
      }
    },
  },
  addPeakListNote: {
    type: UserType,
    args: {
      userId: { type: GraphQLNonNull(GraphQLID) },
      peakListId: { type: GraphQLNonNull(GraphQLID) },
      text: { type: GraphQLNonNull(GraphQLString) },
    },
    async resolve(_unused: any, args: PeakListNoteMutationArgs,
                  context: {user: IUser | undefined | null}) {
      const { userId, peakListId, text } = args;
      try {
        const user = await User.findById(userId);
        if (!isCorrectUser(user, context.user)) {
          throw new Error('Invalid user match');
        }
        await User.findOneAndUpdate({
          '_id': userId,
          'peakListNotes.peakList': { $ne: peakListId },
        }, {
          $addToSet: { peakListNotes: {peakList: peakListId, text} },
        });
        return await User.findOne({_id: userId});
      } catch (err) {
        return err;
      }
    },
  },
  editPeakListNote: {
    type: UserType,
    args: {
      userId: { type: GraphQLNonNull(GraphQLID) },
      peakListId: { type: GraphQLNonNull(GraphQLID) },
      text: { type: GraphQLNonNull(GraphQLString) },
    },
    async resolve(_unused: any, args: PeakListNoteMutationArgs,
                  context: {user: IUser | undefined | null}) {
      const { userId, peakListId, text } = args;
      try {
        const user = await User.findById(userId);
        if (!isCorrectUser(user, context.user)) {
          throw new Error('Invalid user match');
        }
        await User.findOneAndUpdate({
          '_id': userId,
          'peakListNotes.peakList': { $eq: peakListId },
        }, { 'peakListNotes.$.text': text },
        );
        return await User.findOne({_id: userId});
      } catch (err) {
        return err;
      }
    },
  },
  deletePeakListNote: {
    type: UserType,
    args: {
      userId: { type: GraphQLNonNull(GraphQLID) },
      peakListId: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, args: PeakListNoteMutationArgs,
                  context: {user: IUser | undefined | null}) {
      const { userId, peakListId } = args;
      try {
        const user = await User.findById(userId);
        if (!isCorrectUser(user, context.user)) {
          throw new Error('Invalid user match');
        }
        await User.findOneAndUpdate({
          '_id': userId,
          'peakListNotes.peakList': { $eq: peakListId },
        }, {
          $pull: { peakListNotes: { peakList: peakListId } },
        });
        return await User.findOne({_id: userId});
      } catch (err) {
        return err;
      }
    },
  },
  addMountainNote: {
    type: UserType,
    args: {
      userId: { type: GraphQLNonNull(GraphQLID) },
      mountainId: { type: GraphQLNonNull(GraphQLID) },
      text: { type: GraphQLNonNull(GraphQLString) },
    },
    async resolve(_unused: any, args: MountainNoteMutationArgs,
                  context: {user: IUser | undefined | null}) {
      const { userId, mountainId, text } = args;
      try {
        const user = await User.findById(userId);
        if (!isCorrectUser(user, context.user)) {
          throw new Error('Invalid user match');
        }
        await User.findOneAndUpdate({
          '_id': userId,
          'mountainNotes.mountain': { $ne: mountainId },
        }, {
          $addToSet: { mountainNotes: {mountain: mountainId, text} },
        });
        return await User.findOne({_id: userId});
      } catch (err) {
        return err;
      }
    },
  },
  editMountainNote: {
    type: UserType,
    args: {
      userId: { type: GraphQLNonNull(GraphQLID) },
      mountainId: { type: GraphQLNonNull(GraphQLID) },
      text: { type: GraphQLNonNull(GraphQLString) },
    },
    async resolve(_unused: any, args: MountainNoteMutationArgs,
                  context: {user: IUser | undefined | null}) {
      const { userId, mountainId, text } = args;
      try {
        const user = await User.findById(userId);
        if (!isCorrectUser(user, context.user)) {
          throw new Error('Invalid user match');
        }
        await User.findOneAndUpdate({
          '_id': userId,
          'mountainNotes.mountain': { $eq: mountainId },
        }, { 'mountainNotes.$.text': text },
        );
        return await User.findOne({_id: userId});
      } catch (err) {
        return err;
      }
    },
  },
  deleteMountainNote: {
    type: UserType,
    args: {
      userId: { type: GraphQLNonNull(GraphQLID) },
      mountainId: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, args: MountainNoteMutationArgs,
                  context: {user: IUser | undefined | null}) {
      const { userId, mountainId } = args;
      try {
        const user = await User.findById(userId);
        if (!isCorrectUser(user, context.user)) {
          throw new Error('Invalid user match');
        }
        await User.findOneAndUpdate({
          '_id': userId,
          'mountainNotes.mountain': { $eq: mountainId },
        }, {
          $pull: { mountainNotes: { mountain: mountainId } },
        });
        return await User.findOne({_id: userId});
      } catch (err) {
        return err;
      }
    },
  },
  updateMountainPermissions: {
    type: UserType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      mountainPermissions: { type: GraphQLInt },
    },
    async resolve(_unused: any,
                  { id, mountainPermissions }: { id: string , mountainPermissions: number | null},
                  context: {dataloaders: any, user: IUser | undefined | null}) {
      if (!isAdmin(context.user)) {
        throw new Error('Invalid permission');
      }
      try {
        const user = await User.findOneAndUpdate(
        { _id: id },
        { mountainPermissions },
        {new: true});
        context.dataloaders.userLoader.clear(id).prime(id, user);
        return user;
      } catch (err) {
        return err;
      }
    },
  },
};

export default userMutations;
