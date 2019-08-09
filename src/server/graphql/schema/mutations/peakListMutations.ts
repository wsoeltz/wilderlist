/* tslint:disable:await-promise */
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { Mountain as IMountain } from '../../graphQLTypes';
import { removeConnections } from '../../Utils';
import { Mountain } from '../queryTypes/mountainType';
import PeakListType, { PeakList } from '../queryTypes/peakListType';

interface AddPeakListVariables {
  name: string;
  shortName: string;
  standardVariant: boolean;
  winterVariant: boolean;
  fourSeasonVariant: boolean;
  gridVariant: boolean;
  mountains: IMountain[];
}

export const updateVariant = (id: string, variant: string, value: boolean) => {
  return new Promise((resolve, reject) => {
    PeakList.findOne({ _id: id }, {new: true})
      .select({ variants: true })
      .exec(async (err, doc: any) => {
        if (err) {
          console.error(err);
        } else if (doc) {
          try {
            doc.variants[variant] = value;
            await doc.save();
            resolve(true);
          } catch (err) {
            reject(err);
          }
        }
      });
    }
  );
};


const peakListMutations: any = {
  addPeakList: {
    type: PeakListType,
    args: {
      name: { type: GraphQLNonNull(GraphQLString) },
      shortName: { type: GraphQLNonNull(GraphQLString) },
      standardVariant: {type: GraphQLNonNull(GraphQLBoolean) },
      winterVariant: {type: GraphQLNonNull(GraphQLBoolean) },
      fourSeasonVariant: {type: GraphQLNonNull(GraphQLBoolean) },
      gridVariant: {type: GraphQLNonNull(GraphQLBoolean) },
      mountains: { type: new GraphQLList(GraphQLID)},
    },
    resolve(_unused: any, input: AddPeakListVariables) {
      const {
        name, shortName, standardVariant, winterVariant, fourSeasonVariant, gridVariant, mountains,
      } = input;
      if (name !== '' && shortName !== ''
        && standardVariant !== null && winterVariant !== null
        && fourSeasonVariant !== null && gridVariant !== null) {
        const newPeakList = new PeakList({
          name, shortName, mountains,
          variants: {
            standard: standardVariant, winter: winterVariant,
            fourSeason: fourSeasonVariant, grid: gridVariant,
          },
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
    async resolve(_unused: any, { id, newName }: { id: string , newName: string}) {
      const peakList = await PeakList.findOneAndUpdate({
        _id: id,
      },
      { name: newName },
      {new: true});
      return peakList;
    },
  },
  changePeakListShortName: {
    type: PeakListType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      newShortName: { type: GraphQLNonNull(GraphQLString) },
    },
    async resolve(_unused: any, { id, newShortName }: { id: string , newShortName: string}) {
      const peakList = await PeakList.findOneAndUpdate({
        _id: id,
      },
      { shortName: newShortName },
      {new: true});
      return peakList;
    },
  },
  adjustPeakListVariant: {
    type: PeakListType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      variant: { type: GraphQLNonNull(GraphQLString) },
      value: { type: GraphQLNonNull(GraphQLBoolean) },
    },
    async resolve(_unused: any, { id, variant, value }: { id: string , variant: string, value: boolean}) {
      await updateVariant(id, variant, value);
      return PeakList.findOne({ _id: id });
    }
  }
};

export default peakListMutations;
