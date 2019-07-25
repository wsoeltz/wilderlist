/* tslint:disable:await-promise */
import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { State as IState } from '../../graphQLTypes';
import RegionType, { Region } from '../queryTypes/regionType';
import { State } from '../queryTypes/stateType';

const regionMutations: any = {
  addRegion: {
    type: RegionType,
    args: {
      name: { type: GraphQLNonNull(GraphQLString) },
      states: { type: new GraphQLList(GraphQLID)},
    },
    resolve(_unused: any, { name, states }: {name: string, states: IState[]}) {
      const newRegion = new Region({ name, states });
      states.forEach((id) => {
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
      id: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, { id }: { id: string }) {
      const region = await Region.findByIdAndDelete(id)
        .select({states: true})
        .exec(function(err: any, doc: any) {
          if (err) {
            console.error(err);
          } else if (doc) {
            doc.states.forEach(async (stateId: string) => {
              await State.findByIdAndUpdate(stateId, {
                $pull: { regions: id},
              });
            });
          }
      });
      return region;
    },
  },
  addStateToRegion: {
    type: RegionType,
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
          return region;
        }
      } catch (err) {
        return err;
      }
    },
  },
  removeStateFromRegion: {
    type: RegionType,
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
          return region;
        }
      } catch (err) {
        return err;
      }
    },
  },
};

export default regionMutations;
