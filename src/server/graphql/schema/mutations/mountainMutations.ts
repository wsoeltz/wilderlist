/* tslint:disable:await-promise */
import {
  GraphQLFloat,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import {
  Mountain as IMountain,
} from '../../graphQLTypes';
import { removeConnections } from '../../Utils';
import MountainType, { Mountain } from '../queryTypes/mountainType';
import { PeakList } from '../queryTypes/peakListType';
import { State } from '../queryTypes/stateType';

const mountainMutations: any = {
  addMountain: {
    type: MountainType,
    args: {
      name: { type: GraphQLNonNull(GraphQLString) },
      latitude: { type: GraphQLNonNull(GraphQLFloat) },
      longitude: { type: GraphQLNonNull(GraphQLFloat) },
      elevation: { type: GraphQLNonNull(GraphQLFloat) },
      prominence: { type: GraphQLFloat },
      state: { type: GraphQLID },
      lists: { type: new GraphQLList(GraphQLID)},
    },
    async resolve(_unused: any, input: IMountain) {
      const { name, state, lists, latitude, longitude, elevation, prominence } = input;
      const newMountain = new Mountain({ name, state, lists, latitude, longitude, elevation, prominence });
      if ( name !== '') {
        if (lists !== undefined) {
          lists.forEach(async (id) => {
            await PeakList.findOneAndUpdate(
              { _id: id, mountains: { $ne: newMountain.id} },
              { $push: {mountains: newMountain.id} },
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
      }
      return newMountain.save();
    },
  },
  deleteMountain: {
    type: MountainType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, { id }: { id: string }) {
      await State.findOneAndUpdate({ mountains: { $eq: id } },
        { $pull: {mountains: id} }, function(error, model) {
          if (error) { console.error(error); } } );
      await removeConnections(Mountain, id, 'lists', PeakList);
      return Mountain.findByIdAndDelete(id);
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
  updateMountain: {
    type: MountainType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLNonNull(GraphQLString) },
      latitude: { type: GraphQLNonNull(GraphQLFloat) },
      longitude: { type: GraphQLNonNull(GraphQLFloat) },
      elevation: { type: GraphQLNonNull(GraphQLFloat) },
      prominence: { type: GraphQLFloat },
      state: { type: GraphQLID },
    },
    async resolve(_unused: any, input: IMountain) {
      const { id, name, state: stateId, latitude, longitude, elevation, prominence } = input;

      const mountain = await Mountain.findById(id);
      const state = await State.findById(stateId);
      if (mountain !== null && state !== null) {
        await State.findOneAndUpdate({
            mountains: { $eq: id },
          },
          { $pull: {mountains: id} },
          function(err, model) {
            if (err) {
              console.error(err);
            }
          },
        );
        await State.findOneAndUpdate({
            _id: stateId,
            mountains: { $ne: id },
          },
          { $push: {mountains: id} },
          function(err, model) {
            if (err) {
              console.error(err);
            }
          },
        );
        const fields = (prominence) ? { name, state: stateId, latitude, longitude, elevation, prominence }
          : { name, state: stateId, latitude, longitude, elevation };
        const newMountain = await Mountain.findOneAndUpdate({
            _id: id,
          },
          { ...fields },
          {new: true});
        return newMountain;
      } else if (mountain !== null) {
        const fields = (prominence) ? { name, latitude, longitude, elevation, prominence }
          : { name, latitude, longitude, elevation };
        const newMountain = await Mountain.findOneAndUpdate({
            _id: id,
          },
          { ...fields },
          {new: true});
        return newMountain;
      }
    },
  },
};

export default mountainMutations;
