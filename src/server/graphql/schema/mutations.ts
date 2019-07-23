import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose from 'mongoose';
// import { State as StateInterface } from '../graphQLTypes';
import RegionType, { Region } from './regionType';
import /*StateType,*/ { State } from './stateType';

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
    // deleteRegion: {
    //   type: RegionType,
    //   args: {
    //     id: { type: GraphQLID },
    //   },
    //   resolve(parentValue, { id }) {
    //     State.updateMany(
    //       { $elemMatch: {regions: id} },
    //       { $pull: {regions: id} },
    //       (err, raw) => {
    //         console.log({err, raw});
    //       }
    //     );
    //     return Region.findByIdAndDelete(id);
    //   },
    // },
  },
});

export default mutation;
