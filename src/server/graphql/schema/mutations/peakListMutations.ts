/* tslint:disable:await-promise */
import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { Mountain as IMountain } from '../../graphQLTypes';
import { PeakList as IPeakList } from '../../graphQLTypes';
import { removeConnections } from '../../Utils';
import { Mountain } from '../queryTypes/mountainType';
import PeakListType, { PeakList, PeakListVariants } from '../queryTypes/peakListType';

interface AddPeakListVariables {
  name: string;
  shortName: string;
  type: IPeakList['type'];
  mountains: IMountain[];
}

const peakListMutations: any = {
  addPeakList: {
    type: PeakListType,
    args: {
      name: { type: GraphQLNonNull(GraphQLString) },
      shortName: { type: GraphQLNonNull(GraphQLString) },
      type: {type: GraphQLNonNull(PeakListVariants) },
      mountains: { type: new GraphQLList(GraphQLID)},
    },
    resolve(_unused: any, input: AddPeakListVariables) {
      const {
        name, shortName, type, mountains,
      } = input;
      if (name !== '' && shortName !== ''
        && type !== null) {
        const newPeakList = new PeakList({
          name, shortName, mountains,
          type, numUsers: 0,
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
        return newPeakList.save();
      }
    },
  },
  deletePeakList: {
    type: PeakListType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, { id }: { id: string }) {
      await removeConnections(PeakList, id, 'mountains', Mountain);
      return PeakList.findByIdAndDelete(id);
    },
  },
  addItemToPeakList: {
    type: PeakListType,
    args: {
      listId: { type: GraphQLNonNull(GraphQLID) },
      itemId: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, {listId, itemId}: {listId: string, itemId: string}) {
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
          return list;
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
    async resolve(_unused: any, {listId, itemId}: {listId: string, itemId: string}) {
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
          return list;
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
                  {dataloaders}: {dataloaders: any}) {
      const peakList = await PeakList.findOneAndUpdate({
        _id: id,
      },
      { name: newName },
      {new: true});
      dataloaders.peakListLoader.clear(id).prime(id, peakList);
      return peakList;
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
                  {dataloaders}: {dataloaders: any}) {
      const peakList = await PeakList.findOneAndUpdate({
        _id: id,
      },
      { shortName: newShortName },
      {new: true});
      dataloaders.peakListLoader.clear(id).prime(id, peakList);
      return peakList;
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
                  {dataloaders}: {dataloaders: any}) {
      const peakList = await PeakList.findOneAndUpdate({
        _id: id,
      },
      { type },
      {new: true});
      dataloaders.peakListLoader.clear(id).prime(id, peakList);
      return peakList;
    },
  },
};

export default peakListMutations;
