/* tslint:disable:await-promise */
import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { Region as IRegion } from '../../graphQLTypes';
import { Region } from '../queryTypes/regionType';
import StateType, { State } from '../queryTypes/stateType';

const stateMutations: any = {
  addState: {
    type: StateType,
    args: {
      name: { type: GraphQLNonNull(GraphQLString) },
      regions: { type: new GraphQLList(GraphQLID)},
    },
    resolve(_unused: any, { name, regions }: {name: string, regions: IRegion[]}) {
      const newState = new State({ name, regions });
      if (regions !== undefined && name !== '') {
        regions.forEach((id) => {
          Region.findByIdAndUpdate(id,
            { $push: {states: newState.id} },
            function(err, model) {
              if (err) {
                console.error(err);
              }
            },
          );
        });
      }
      return newState.save();
    },
  },
  deleteState: {
    type: StateType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, { id }: { id: string }) {
      await State.findById(id)
        .select({regions: true})
        .exec(function(err: any, doc: any) {
          if (err) {
            console.error(err);
          } else if (doc) {
            doc.regions.forEach(async (regionId: string) => {
              await Region.findByIdAndUpdate(regionId, {
                $pull: { states: id},
              });
            });
          }
      });
      return State.findByIdAndDelete(id);
    },
  },
  changeStateName: {
    type: StateType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      newName: { type: GraphQLNonNull(GraphQLString) },
    },
    async resolve(_unused: any, { id, newName }: { id: string , newName: string}) {
      const state = await State.findOneAndUpdate({
        _id: id,
      },
      { name: newName },
      {new: true});
      return state;
    },
  },
  addRegionToState: {
    type: StateType,
    args: {
      regionId: { type: GraphQLNonNull(GraphQLID) },
      stateId: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, {regionId, stateId}: {regionId: string, stateId: string}) {
      try {
        const region = await Region.findById(regionId);
        const state = await State.findById(stateId);
        if (region !== null && state !== null) {
          await State.findOneAndUpdate({
              _id: stateId,
              regions: { $ne: regionId },
            },
            { $push: {regions: regionId} },
            function(err, model) {
              if (err) {
                console.error(err);
              }
            },
          );
          await Region.findOneAndUpdate({
              _id: regionId,
              states: { $ne: stateId },
            },
            { $push: {states: stateId} },
            function(err, model) {
              if (err) {
                console.error(err);
              }
            },
          );
          return state;
        }
      } catch (err) {
        return err;
      }
    },
  },
  removeRegionFromState: {
    type: StateType,
    args: {
      regionId: { type: GraphQLNonNull(GraphQLID) },
      stateId: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, {regionId, stateId}: {regionId: string, stateId: string}) {
      try {
        const region = await Region.findById(regionId);
        const state = await State.findById(stateId);
        if (region !== null && state !== null) {
          await State.findOneAndUpdate({
              _id: stateId,
            },
            { $pull: {regions: regionId} },
            function(err, model) {
              if (err) {
                console.error(err);
              }
            },
          );
          await Region.findOneAndUpdate({
              _id: regionId,
            },
            { $pull: {states: stateId} },
            function(err, model) {
              if (err) {
                console.error(err);
              }
            },
          );
          return state;
        }
      } catch (err) {
        return err;
      }
    },
  },
};

export default stateMutations;
