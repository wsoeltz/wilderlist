import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose from 'mongoose';
import RegionType, { Region } from './regionType';
import { State } from './stateType';

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
  },
});

export default mutation;
