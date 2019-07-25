/* tslint:disable:await-promise */
import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import {
  List as IList,
  State as IState,
} from '../../graphQLTypes';
import { List } from '../queryTypes/listType';
import MountainType, { Mountain } from '../queryTypes/mountainType';
import { State } from '../queryTypes/stateType';

const mountainMutations: any = {
  addMountain: {
    type: MountainType,
    args: {
      name: { type: GraphQLNonNull(GraphQLString) },
      state: { type: GraphQLID },
      lists: { type: new GraphQLList(GraphQLID)},
    },
    async resolve(_unused: any, { name, state, lists }: {name: string, state: IState, lists: IList[]}) {
      const newMountain = new Mountain({ name, state, lists });
      if (lists !== undefined) {
        lists.forEach(async (id) => {
          await List.findOneAndUpdate(
            { _id: id, items: { $ne: newMountain.id} },
            { $push: {items: newMountain.id} },
            function(err, model) {
              if (err) {
                console.error(err);
              }
            },
          );
        });
      }
      await State.findByIdAndUpdate(state,
        { $push: {mountains: newMountain.id} });
      return newMountain.save();
    },
  },
  deleteMountain: {
    type: MountainType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, { id }: { id: string }) {
      const mountain = await Mountain.findByIdAndDelete(id)
        .select({lists: true})
        .exec(function(err: any, doc: any) {
          if (err) {
            console.error(err);
          } else if (doc) {
            doc.lists.forEach(async (listId: string) => {
              await List.findByIdAndUpdate(listId, {
                $pull: { items: id},
              });
            });
          }
          State.findOneAndUpdate({
            mountains: { $eq: id },
          },
          { $pull: {mountains: id} },
          function(error, model) {
            if (error) {
              console.error(err);
            }
          },
        );
      });
      return mountain;
    },
  },
  addMountainToState: {
    type: MountainType,
    args: {
      mountainId: { type: GraphQLNonNull(GraphQLID) },
      stateId: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, {mountainId, stateId}: {mountainId: string, stateId: string}) {
      try {
        const mountain = await Mountain.findById(mountainId);
        const state = await State.findById(stateId);
        if (mountain !== null && state !== null) {
          await State.findOneAndUpdate({
              mountains: { $eq: mountainId },
            },
            { $pull: {mountains: mountainId} },
            function(err, model) {
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
            function(err, model) {
              if (err) {
                console.error(err);
              }
            },
          );
          await Mountain.findOneAndUpdate({
              _id: mountainId,
            },
            { state: stateId },
            function(err, model) {
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
};

export default mountainMutations;
