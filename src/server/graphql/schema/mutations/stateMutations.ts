/* tslint:disable:await-promise */
import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { State as IState } from '../../graphQLTypes';
import { removeConnections } from '../../Utils';
import { Mountain } from '../queryTypes/mountainType';
import { Region } from '../queryTypes/regionType';
import StateType, { State } from '../queryTypes/stateType';

const stateMutations: any = {
  addState: {
    type: StateType,
    args: {
      name: { type: GraphQLNonNull(GraphQLString) },
      abbreviation: { type: GraphQLNonNull(GraphQLString) },
      regions: { type: new GraphQLList(GraphQLID)},
    },
    resolve(_unused: any, { name, regions, abbreviation }: IState) {
      const newState = new State({ name, regions, abbreviation });
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
      try {
        await Mountain.findOneAndUpdate({ state: { $eq: id } },
          { state: null }, function(error, model) {
            if (error) { console.error(error); } } );
        await removeConnections(State, id, 'regions', Region, 'states');
        return State.findByIdAndDelete(id);
      } catch (err) {
        return err;
      }
    },
  },
  changeStateName: {
    type: StateType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      newName: { type: GraphQLNonNull(GraphQLString) },
    },
    async resolve(_unused: any,
                  { id, newName }: { id: string , newName: string},
                  {dataloaders}: {dataloaders: any}) {
      try {
        const state = await State.findOneAndUpdate({
          _id: id,
        },
        { name: newName },
        {new: true});
        dataloaders.stateLoader.clear(id).prime(id, state);
        return state;
      } catch (err) {
        return err;
      }
    },
  },
  changeStateAbbreviation: {
    type: StateType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      newAbbreviation: { type: GraphQLNonNull(GraphQLString) },
    },
    async resolve(_unused: any,
                  { id, newAbbreviation }: { id: string , newAbbreviation: string},
                  {dataloaders}: {dataloaders: any}) {
      try {
        const state = await State.findOneAndUpdate({
          _id: id,
        },
        { abbreviation: newAbbreviation },
        {new: true});
        dataloaders.stateLoader.clear(id).prime(id, state);
        return state;
      } catch (err) {
        return err;
      }
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
