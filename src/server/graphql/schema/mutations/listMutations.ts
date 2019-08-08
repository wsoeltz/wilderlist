/* tslint:disable:await-promise */
import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { Mountain as IMountain } from '../../graphQLTypes';
import ListType, { List } from '../queryTypes/listType';
import { Mountain } from '../queryTypes/mountainType';

const listMutations: any = {
  addList: {
    type: ListType,
    args: {
      name: { type: GraphQLNonNull(GraphQLString) },
      items: { type: new GraphQLList(GraphQLID)},
    },
    resolve(_unused: any, { name, items }: {name: string, items: IMountain[]}) {
      const newList = new List({ name, items });
      if (items !== undefined && name !== '') {
        items.forEach((id) => {
          Mountain.findByIdAndUpdate(id,
            { $push: {lists: newList.id} },
            function(err, model) {
              if (err) {
                console.error(err);
              }
            },
          );
        });
      }
      return newList.save();
    },
  },
  deleteList: {
    type: ListType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, { id }: { id: string }) {
      await List.findById(id)
        .select({items: true})
        .exec(function(err: any, doc: any) {
          if (err) {
            console.error(err);
          } else if (doc) {
            doc.items.forEach(async (itemId: string) => {
              await Mountain.findByIdAndUpdate(itemId, {
                $pull: { lists: id},
              });
            });
          }
      });
      return List.findByIdAndDelete(id);
    },
  },
  addItemToList: {
    type: ListType,
    args: {
      listId: { type: GraphQLNonNull(GraphQLID) },
      itemId: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, {listId, itemId}: {listId: string, itemId: string}) {
      try {
        const list = await List.findById(listId);
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
          await List.findOneAndUpdate({
              _id: listId,
              items: { $ne: itemId },
            },
            { $push: {items: itemId} },
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
  removeItemFromList: {
    type: ListType,
    args: {
      listId: { type: GraphQLNonNull(GraphQLID) },
      itemId: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, {listId, itemId}: {listId: string, itemId: string}) {
      try {
        const list = await List.findById(listId);
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
          await List.findOneAndUpdate({
              _id: listId,
            },
            { $pull: {items: itemId} },
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
};

export default listMutations;
