import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose from 'mongoose';
import RegionType, { Region } from './regionType';
import StateType, { State } from './stateType';
// import { Mountain } from './mountainType';

mongoose.set('useFindAndModify', false);

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addRegion: {
      type: RegionType,
      args: {
        name: { type: GraphQLString },
        states: { type: new GraphQLList(GraphQLID)},
      },
      resolve(parentValue, { name, states }) {
        const newRegion = new Region({ name, states });
        states.forEach((id: string[]) => {
          State.findByIdAndUpdate(id,
            { $push: {regions: newRegion.id} },
            function(err, model) {
              if (err) {
                console.error(err);
              }
            },
          );
        });
        return newRegion.save();
      },
    },
    deleteRegion: {
      type: RegionType,
      args: {
        id: { type: GraphQLID },
      },
      async resolve(parentValue, { id }) {
        const region = await Region.findByIdAndDelete(id)
          .select({states: true})
          .exec(function(err: any, doc: any) {
            if (err) {
              console.error(err);
            } else if (doc) {
              doc.states.forEach(async (stateId: string) => {
                // tslint:disable-next-line:await-promise
                await State.findByIdAndUpdate(stateId, {
                  $pull: { regions: id},
                });
              });
            }
        });
        return region;
      },
    },
    addState: {
      type: StateType,
      args: {
        name: { type: GraphQLString },
        regions: { type: new GraphQLList(GraphQLID)},
      },
      resolve(parentValue, { name, states, regions }) {
        const newState = new State({ name, regions });
        regions.forEach((id: string[]) => {
          Region.findByIdAndUpdate(id,
            { $push: {states: newState.id} },
            function(err, model) {
              if (err) {
                console.error(err);
              }
            },
          );
        });
        return newState.save();
      },
    },
    deleteState: {
      type: StateType,
      args: {
        id: { type: GraphQLID },
      },
      async resolve(parentValue, { id }) {
        const state = await State.findByIdAndDelete(id)
          .select({regions: true})
          .exec(function(err: any, doc: any) {
            if (err) {
              console.error(err);
            } else if (doc) {
              doc.regions.forEach(async (regionId: string) => {
                // tslint:disable-next-line:await-promise
                await Region.findByIdAndUpdate(regionId, {
                  $pull: { states: id},
                });
              });
            }
        });
        return state;
      },
    },
  },
});

export default mutation;
