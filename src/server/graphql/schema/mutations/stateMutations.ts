import {
  GraphQLID,
  GraphQLList,
  GraphQLString,
} from 'graphql';
import { Region as IRegion } from '../../graphQLTypes';
import { Region } from '../queryTypes/regionType';
import StateType, { State } from '../queryTypes/stateType';

const stateMutations: any = {
  addState: {
    type: StateType,
    args: {
      name: { type: GraphQLString },
      regions: { type: new GraphQLList(GraphQLID)},
    },
    resolve(_unused: any, { name, regions }: {name: string, regions: IRegion[]}) {
      const newState = new State({ name, regions });
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
      return newState.save();
    },
  },
  deleteState: {
    type: StateType,
    args: {
      id: { type: GraphQLID },
    },
    async resolve(_unused: any, { id }: { id: string }) {
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
};

export default stateMutations;
