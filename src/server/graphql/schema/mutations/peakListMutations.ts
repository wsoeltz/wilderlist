/* tslint:disable:await-promise */
import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { isAdmin, isCorrectUser, isLoggedIn } from '../../authorization';
import {
  CreatedItemStatus as CreatedItemStatusEnum,
  ExternalResource,
  Mountain as IMountain,
  PeakList as IPeakList,
  PeakListFlag as PeakListFlagEnum,
  PermissionTypes,
  State as IState,
  User as IUser,
} from '../../graphQLTypes';
import { getType, removeConnections } from '../../Utils';
import { CreatedItemStatus, Mountain } from '../queryTypes/mountainType';
import PeakListType, {
  PeakList,
  PeakListFlag,
  PeakListTier,
  PeakListVariants,
} from '../queryTypes/peakListType';
import { State } from '../queryTypes/stateType';
import { User } from '../queryTypes/userType';

interface BaseVariables {
  name: string;
  shortName: string;
  description: string | null;
  optionalPeaksDescription: string | null;
  type: IPeakList['type'];
  mountains: IMountain[];
  optionalMountains: IMountain[];
  parent: IPeakList;
  states: IState[];
  resources: IPeakList['resources'];
  tier: IPeakList['tier'];
}

interface AddPeakListVariables extends BaseVariables {
  author: IPeakList['author'];
}

interface EditPeakListVariables extends BaseVariables {
  id: IPeakList['id'];
}

export const ExternalResourcesInputType: any = new GraphQLInputObjectType({
  name: 'ExternalResourcesInputType',
  fields: () => ({
    title: {
      type: GraphQLString,
    },
    url: {
      type: GraphQLString,
    },
  }),
});

const peakListMutations: any = {
  addPeakList: {
    type: PeakListType,
    args: {
      name: { type: GraphQLNonNull(GraphQLString) },
      shortName: { type: GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLString },
      optionalPeaksDescription: { type: GraphQLString },
      type: {type: GraphQLNonNull(PeakListVariants) },
      mountains: { type: new GraphQLList(GraphQLID)},
      optionalMountains: { type: new GraphQLList(GraphQLID)},
      states: { type: new GraphQLList(GraphQLID)},
      parent: {type: GraphQLID },
      resources: { type: new GraphQLList(ExternalResourcesInputType) },
      author: { type: GraphQLID },
      tier: { type: PeakListTier },
    },
    async resolve(_unused: any, input: AddPeakListVariables, {user}: {user: IUser | undefined | null}) {
      const {
        name, shortName, type, mountains, parent, states,
        description, optionalMountains, optionalPeaksDescription,
        resources, author, tier,
      } = input;
      if (name !== '' && shortName !== '' && type !== null) {
        const authorObj = await User.findById(author);
        if (!(isCorrectUser(user, authorObj) || isAdmin(user))) {
          throw new Error('Invalid user match');
        }
        let status: CreatedItemStatusEnum | null;
        if (!authorObj) {
          status = null;
        } else if ( (authorObj.peakListPermissions !== null &&
              authorObj.peakListPermissions > 5 ) ||
          authorObj.permissions === PermissionTypes.admin) {
          status = CreatedItemStatusEnum.auto;
        } else if (authorObj.peakListPermissions !== null &&
              authorObj.peakListPermissions === -1) {
          return null;
        } else {
          status = CreatedItemStatusEnum.pending;
        }

        const searchString = name + getType(type) + ' ' + shortName + ' ' + type;
        const newPeakList = new PeakList({
          name, shortName, mountains, optionalMountains,
          type, parent, numUsers: 0,
          searchString, states, description, optionalPeaksDescription,
          resources, author, status, tier,
        });
        if (mountains !== undefined) {
          mountains.forEach((id) => {
            Mountain.findByIdAndUpdate(id,
              { $push: {lists: newPeakList.id} },
              function(err, model) {
                PeakList.update({ $push: { mountains: id } });
                if (err) {
                  console.error(err);
                }
              },
            );
          });
        }
        if (optionalMountains !== undefined) {
          optionalMountains.forEach((id) => {
            Mountain.findByIdAndUpdate(id,
              { $push: {optionalLists: newPeakList.id} },
              function(err, model) {
                PeakList.update({ $push: { optionalMountains: id } });
                if (err) {
                  console.error(err);
                }
              },
            );
          });
        }
        if (states !== undefined) {
          states.forEach((id) => {
            State.findByIdAndUpdate(id,
              { $push: {peakLists: newPeakList.id} },
              function(err, model) {
                PeakList.update({ $push: { states: id } });
                if (err) {
                  console.error(err);
                }
              },
            );
          });
        }
        return newPeakList.save();
      }
    },
  },
  editPeakList: {
    type: PeakListType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLNonNull(GraphQLString) },
      shortName: { type: GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLString },
      optionalPeaksDescription: { type: GraphQLString },
      type: {type: GraphQLNonNull(PeakListVariants) },
      mountains: { type: new GraphQLList(GraphQLID)},
      optionalMountains: { type: new GraphQLList(GraphQLID)},
      states: { type: new GraphQLList(GraphQLID)},
      parent: {type: GraphQLID },
      resources: { type: new GraphQLList(ExternalResourcesInputType) },
      tier: { type: PeakListTier },
    },
    async resolve(_unused: any, input: EditPeakListVariables, {user}: {user: IUser | undefined | null}) {
      const {
        name, shortName, type, mountains, parent, states,
        description, optionalMountains, optionalPeaksDescription,
        resources, id, tier,
      } = input;
      if (name !== '' && shortName !== '' && type !== null) {
        const peakList = await PeakList.findById(id);
        const authorObj = peakList && peakList.author ? peakList.author : null;
        if (!(isCorrectUser(user, authorObj) || isAdmin(user))) {
          throw new Error('Invalid user match');
        }

        await removeConnections(PeakList, id, 'mountains', Mountain, 'lists');
        await removeConnections(PeakList, id, 'optionalMountains', Mountain, 'optionalLists');
        await removeConnections(PeakList, id, 'users', User, 'peakLists');
        await removeConnections(PeakList, id, 'states', State, 'peakLists');

        const searchString = name + getType(type) + ' ' + shortName + ' ' + type;
        const newPeakList = await PeakList.findOneAndUpdate({
              _id: id,
            },
            { name, shortName, mountains, optionalMountains,
              type, parent, searchString, states, description,
              optionalPeaksDescription, resources, tier },
            {new: true});
        if (newPeakList) {
          if (mountains !== undefined) {
            mountains.forEach((mtnId) => {
              Mountain.findByIdAndUpdate(mtnId,
                { $push: {lists: newPeakList.id} },
                function(err, model) {
                  PeakList.update({ $push: { mountains: mtnId } });
                  if (err) {
                    console.error(err);
                  }
                },
              );
            });
          }
          if (optionalMountains !== undefined) {
            optionalMountains.forEach((mtnId) => {
              Mountain.findByIdAndUpdate(mtnId,
                { $push: {optionalLists: newPeakList.id} },
                function(err, model) {
                  PeakList.update({ $push: { optionalMountains: mtnId } });
                  if (err) {
                    console.error(err);
                  }
                },
              );
            });
          }
          if (states !== undefined) {
            states.forEach((stateId) => {
              State.findByIdAndUpdate(stateId,
                { $push: {peakLists: newPeakList.id} },
                function(err, model) {
                  PeakList.update({ $push: { states: stateId } });
                  if (err) {
                    console.error(err);
                  }
                },
              );
            });
          }
          return newPeakList.save();
        } else {
          return null;
        }
      }
    },
  },
  deletePeakList: {
    type: PeakListType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, { id }: { id: string }, {user}: {user: IUser | undefined | null}) {
      if (!isAdmin(user)) {
        throw new Error('Invalid permission');
      }
      try {
        await removeConnections(PeakList, id, 'mountains', Mountain, 'lists');
        await removeConnections(PeakList, id, 'optionalMountains', Mountain, 'optionalLists');
        await removeConnections(PeakList, id, 'users', User, 'peakLists');
        await removeConnections(PeakList, id, 'states', State, 'peakLists');
        return PeakList.findByIdAndDelete(id);
      } catch (err) {
        return err;
      }
    },
  },
  addItemToPeakList: {
    type: PeakListType,
    args: {
      listId: { type: GraphQLNonNull(GraphQLID) },
      itemId: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, {listId, itemId}: {listId: string, itemId: string},
                  {user}: {user: IUser | undefined | null}) {
      if (!isAdmin(user)) {
        throw new Error('Invalid permission');
      }
      try {
        const list = await PeakList.findById(listId);
        const item = await Mountain.findById(itemId);
        if (list !== null && item !== null) {
          await Mountain.findOneAndUpdate({
              _id: itemId,
              lists: { $ne: listId },
            },
            { $push: {lists: listId} },
            function(err, model) {
              if (err) {
                console.error(err);
              }
            },
          );
          await PeakList.findOneAndUpdate({
              _id: listId,
              mountains: { $ne: itemId },
            },
            { $push: {mountains: itemId} },
            function(err, model) {
              if (err) {
                console.error(err);
              }
            },
          );
          return await PeakList.findById(listId);
        }
      } catch (err) {
        return err;
      }
    },
  },
  removeItemFromPeakList: {
    type: PeakListType,
    args: {
      listId: { type: GraphQLNonNull(GraphQLID) },
      itemId: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, {listId, itemId}: {listId: string, itemId: string},
                  {user}: {user: IUser | undefined | null}) {
      if (!isAdmin(user)) {
        throw new Error('Invalid permission');
      }
      try {
        const list = await PeakList.findById(listId);
        const item = await Mountain.findById(itemId);
        if (list !== null && item !== null) {
          await Mountain.findOneAndUpdate({
              _id: itemId,
            },
            { $pull: {lists: listId} },
            function(err, model) {
              if (err) {
                console.error(err);
              }
            },
          );
          await PeakList.findOneAndUpdate({
              _id: listId,
            },
            { $pull: {mountains: itemId} },
            function(err, model) {
              if (err) {
                console.error(err);
              }
            },
          );
          return await PeakList.findById(listId);
        }
      } catch (err) {
        return err;
      }
    },
  },
  addOptionalMountainToPeakList: {
    type: PeakListType,
    args: {
      listId: { type: GraphQLNonNull(GraphQLID) },
      itemId: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, {listId, itemId}: {listId: string, itemId: string},
                  {user}: {user: IUser | undefined | null}) {
      if (!isAdmin(user)) {
        throw new Error('Invalid permission');
      }
      try {
        const list = await PeakList.findById(listId);
        const item = await Mountain.findById(itemId);
        if (list !== null && item !== null) {
          await Mountain.findOneAndUpdate({
              _id: itemId,
              optionalLists: { $ne: listId },
            },
            { $push: {optionalLists: listId} },
            function(err, model) {
              if (err) {
                console.error(err);
              }
            },
          );
          await PeakList.findOneAndUpdate({
              _id: listId,
              optionalMountains: { $ne: itemId },
            },
            { $push: {optionalMountains: itemId} },
            function(err, model) {
              if (err) {
                console.error(err);
              }
            },
          );
          return PeakList.findById(listId);
        }
      } catch (err) {
        return err;
      }
    },
  },
  removeOptionalMountainFromPeakList: {
    type: PeakListType,
    args: {
      listId: { type: GraphQLNonNull(GraphQLID) },
      itemId: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, {listId, itemId}: {listId: string, itemId: string},
                  {user}: {user: IUser | undefined | null}) {
      if (!isAdmin(user)) {
        throw new Error('Invalid permission');
      }
      try {
        const list = await PeakList.findById(listId);
        const item = await Mountain.findById(itemId);
        if (list !== null && item !== null) {
          await Mountain.findOneAndUpdate({
              _id: itemId,
            },
            { $pull: {optionalLists: listId} },
            function(err, model) {
              if (err) {
                console.error(err);
              }
            },
          );
          await PeakList.findOneAndUpdate({
              _id: listId,
            },
            { $pull: {optionalMountains: itemId} },
            function(err, model) {
              if (err) {
                console.error(err);
              }
            },
          );
          return PeakList.findById(listId);
        }
      } catch (err) {
        return err;
      }
    },
  },
  addStateToPeakList: {
    type: PeakListType,
    args: {
      listId: { type: GraphQLNonNull(GraphQLID) },
      stateId: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, {listId, stateId}: {listId: string, stateId: string},
                  {user}: {user: IUser | undefined | null}) {
      if (!isAdmin(user)) {
        throw new Error('Invalid permission');
      }
      try {
        const list = await PeakList.findById(listId);
        const state = await State.findById(stateId);
        if (list !== null && state !== null) {
          await State.findOneAndUpdate({
              _id: stateId,
              peakLists: { $ne: listId },
            },
            { $push: {peakLists: listId} },
            function(err: any, model: any) {
              if (err) {
                console.error(err);
              }
            },
          );
          await PeakList.findOneAndUpdate({
              _id: listId,
              states: { $ne: stateId },
            },
            { $push: {states: stateId} },
            function(err, model) {
              if (err) {
                console.error(err);
              }
            },
          );
          return await PeakList.findById(listId);
        }
      } catch (err) {
        return err;
      }
    },
  },
  removeStateFromPeakList: {
    type: PeakListType,
    args: {
      listId: { type: GraphQLNonNull(GraphQLID) },
      stateId: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, {listId, stateId}: {listId: string, stateId: string},
                  {user}: {user: IUser | undefined | null}) {
      if (!isAdmin(user)) {
        throw new Error('Invalid permission');
      }
      try {
        const list = await PeakList.findById(listId);
        const state = await State.findById(stateId);
        if (list !== null && state !== null) {
          await State.findOneAndUpdate({
              _id: stateId,
            },
            { $pull: {peakLists: listId} },
            function(err, model) {
              if (err) {
                console.error(err);
              }
            },
          );
          await PeakList.findOneAndUpdate({
              _id: listId,
            },
            { $pull: {states: stateId} },
            function(err, model) {
              if (err) {
                console.error(err);
              }
            },
          );
          return await PeakList.findById(listId);
        }
      } catch (err) {
        return err;
      }
    },
  },
  changePeakListName: {
    type: PeakListType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      newName: { type: GraphQLNonNull(GraphQLString) },
    },
    async resolve(_unused: any,
                  { id, newName }: { id: string , newName: string},
                  {dataloaders, user}: {dataloaders: any, user: IUser | undefined | null}) {
      if (!isAdmin(user)) {
        throw new Error('Invalid permission');
      }
      try {
        const peakList = await PeakList.findOneAndUpdate({
          _id: id,
        },
        { name: newName },
        {new: true});
        if (peakList) {
          const {shortName, type} = peakList;
          const newSearchString = newName + getType(type) + ' ' + shortName + ' ' + type;
          await PeakList.findOneAndUpdate({
            _id: id,
          },
          {searchString: newSearchString },
          {new: true});
        }
        dataloaders.peakListLoader.clear(id).prime(id, peakList);
        return peakList;
      } catch (err) {
        return err;
      }
    },
  },
  changePeakListShortName: {
    type: PeakListType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      newShortName: { type: GraphQLNonNull(GraphQLString) },
    },
    async resolve(_unused: any,
                  { id, newShortName }: { id: string , newShortName: string},
                  {dataloaders, user}: {dataloaders: any, user: IUser | undefined | null}) {
      if (!isAdmin(user)) {
        throw new Error('Invalid permission');
      }
      try {
        const peakList = await PeakList.findOneAndUpdate({
          _id: id,
        },
        { shortName: newShortName },
        {new: true});
        if (peakList) {
          const {name, type} = peakList;
          const newSearchString = name + getType(type) + ' ' + newShortName + ' ' + type;
          await PeakList.findOneAndUpdate({
            _id: id,
          },
          {searchString: newSearchString },
          {new: true});
        }
        dataloaders.peakListLoader.clear(id).prime(id, peakList);
        return peakList;
      } catch (err) {
        return err;
      }
    },
  },
  changePeakListDescription: {
    type: PeakListType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      newDescription: { type: GraphQLString },
    },
    async resolve(_unused: any,
                  { id, newDescription }: { id: string , newDescription: string},
                  {dataloaders, user}: {dataloaders: any, user: IUser | undefined | null}) {
      if (!isAdmin(user)) {
        throw new Error('Invalid permission');
      }
      try {
        const peakList = await PeakList.findOneAndUpdate({
          _id: id,
        },
        { description: newDescription },
        {new: true});
        dataloaders.peakListLoader.clear(id).prime(id, peakList);
        return peakList;
      } catch (err) {
        return err;
      }
    },
  },
  changePeakListOptionalPeaksDescription: {
    type: PeakListType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      newOptionalPeaksDescription: { type: GraphQLString },
    },
    async resolve(_unused: any,
                  { id, newOptionalPeaksDescription }: { id: string , newOptionalPeaksDescription: string},
                  {dataloaders, user}: {dataloaders: any, user: IUser | undefined | null}) {
      if (!isAdmin(user)) {
        throw new Error('Invalid permission');
      }
      try {
        const peakList = await PeakList.findOneAndUpdate({
          _id: id,
        },
        { optionalPeaksDescription: newOptionalPeaksDescription },
        {new: true});
        dataloaders.peakListLoader.clear(id).prime(id, peakList);
        return peakList;
      } catch (err) {
        return err;
      }
    },
  },
  changePeakListResources: {
    type: PeakListType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      resources: { type: new GraphQLList(ExternalResourcesInputType) },
    },
    async resolve(_unused: any,
                  { id, resources }: { id: string , resources: ExternalResource[]},
                  {dataloaders, user}: {dataloaders: any, user: IUser | undefined | null}) {
      if (!isAdmin(user)) {
        throw new Error('Invalid permission');
      }
      try {
        const peakList = await PeakList.findOneAndUpdate({
          _id: id,
        },
        { resources },
        {new: true});
        dataloaders.peakListLoader.clear(id).prime(id, peakList);
        return peakList;
      } catch (err) {
        return err;
      }
    },
  },
  adjustPeakListVariant: {
    type: PeakListType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      type: { type: GraphQLNonNull(PeakListVariants) },
    },
    async resolve(_unused: any,
                  { id, type }: { id: string , type: IPeakList['type'] },
                  {dataloaders, user}: {dataloaders: any, user: IUser | undefined | null}) {
      if (!isAdmin(user)) {
        throw new Error('Invalid permission');
      }
      try {
        const peakList = await PeakList.findOneAndUpdate({
          _id: id,
        },
        { type },
        {new: true});
        if (peakList) {
          const {name, shortName} = peakList;
          const newSearchString = name + getType(type) + ' ' + shortName + ' ' + type;
          await PeakList.findOneAndUpdate({
            _id: id,
          },
          {searchString: newSearchString },
          {new: true});
        }
        dataloaders.peakListLoader.clear(id).prime(id, peakList);
        return peakList;
      } catch (err) {
        return err;
      }
    },
  },
  changePeakListParent: {
    type: PeakListType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      parent: { type: GraphQLID },
    },
    async resolve(_unused: any,
                  { id, parent }: { id: string , parent: string | null },
                  {dataloaders, user}: {dataloaders: any, user: IUser | undefined | null}) {
      if (!isAdmin(user)) {
        throw new Error('Invalid permission');
      }
      try {
        const peakList = await PeakList.findOneAndUpdate({
          _id: id,
        },
        { parent },
        {new: true});
        dataloaders.peakListLoader.clear(id).prime(id, peakList);
        return peakList;
      } catch (err) {
        return err;
      }
    },
  },
  updatePeakListStatus: {
    type: PeakListType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      status: { type: CreatedItemStatus },
    },
    async resolve(_unused: any,
                  { id, status }: { id: string , status: CreatedItemStatusEnum | null},
                  {dataloaders, user}: {dataloaders: any, user: IUser | undefined | null}) {
      if (!isAdmin(user)) {
        throw new Error('Invalid permission');
      }
      try {
        const peakList = await PeakList.findOneAndUpdate(
        { _id: id },
        { status },
        {new: true});
        dataloaders.peakListLoader.clear(id).prime(id, peakList);
        return peakList;
      } catch (err) {
        return err;
      }
    },
  },
  updatePeakListFlag: {
    type: PeakListType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      flag: { type: PeakListFlag },
    },
    async resolve(_unused: any,
                  { id, flag }: { id: string , flag: PeakListFlagEnum | null},
                  {dataloaders, user}: {dataloaders: any, user: IUser | undefined | null}) {
      if (!isLoggedIn(user)) {
        throw new Error('You must be logged in');
      }
      try {
        const peakList = await PeakList.findOneAndUpdate(
        { _id: id },
        { flag },
        {new: true});
        dataloaders.peakListLoader.clear(id).prime(id, peakList);
        return peakList;
      } catch (err) {
        return err;
      }
    },
  },
};

export default peakListMutations;
