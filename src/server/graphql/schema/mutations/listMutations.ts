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
      if (items !== undefined) {
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
      const list = await List.findByIdAndDelete(id)
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
      return list;
    },
  },
  // addItemToList: {
  //   type: ListType,
  //   args: {
  //     listId: { type: GraphQLNonNull(GraphQLID) },
  //     stateId: { type: GraphQLNonNull(GraphQLID) },
  //   },
  //   async resolve(_unused: any, {listId, stateId}: {listId: string, stateId: string}) {
  //     try {
  //       const list = await List.findById(listId);
  //       const state = await State.findById(stateId);
  //       if (list !== null && state !== null) {
  //         await State.findOneAndUpdate({
  //             _id: stateId,
  //             lists: { $ne: listId },
  //           },
  //           { $push: {lists: listId} },
  //           function(err, model) {
  //             if (err) {
  //               console.error(err);
  //             }
  //           },
  //         );
  //         await List.findOneAndUpdate({
  //             _id: listId,
  //             states: { $ne: stateId },
  //           },
  //           { $push: {states: stateId} },
  //           function(err, model) {
  //             if (err) {
  //               console.error(err);
  //             }
  //           },
  //         );
  //         return list;
  //       }
  //     } catch (err) {
  //       return err;
  //     }
  //   },
  // },
  // removeItemFromList: {
  //   type: ListType,
  //   args: {
  //     listId: { type: GraphQLNonNull(GraphQLID) },
  //     stateId: { type: GraphQLNonNull(GraphQLID) },
  //   },
  //   async resolve(_unused: any, {listId, stateId}: {listId: string, stateId: string}) {
  //     try {
  //       const list = await List.findById(listId);
  //       const state = await State.findById(stateId);
  //       if (list !== null && state !== null) {
  //         await State.findOneAndUpdate({
  //             _id: stateId,
  //           },
  //           { $pull: {lists: listId} },
  //           function(err, model) {
  //             if (err) {
  //               console.error(err);
  //             }
  //           },
  //         );
  //         await List.findOneAndUpdate({
  //             _id: listId,
  //           },
  //           { $pull: {states: stateId} },
  //           function(err, model) {
  //             if (err) {
  //               console.error(err);
  //             }
  //           },
  //         );
  //         return list;
  //       }
  //     } catch (err) {
  //       return err;
  //     }
  //   },
  // },
};

export default listMutations;
