import {
  GraphQLID,
  GraphQLList,
  GraphQLString,
} from 'graphql';
import { State as IState } from '../../graphQLTypes';
import RegionType, { Region } from '../queryTypes/regionType';
import { State } from '../queryTypes/stateType';

const regionMutations: any = {
  addRegion: {
    type: RegionType,
    args: {
      name: { type: GraphQLString },
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
      id: { type: GraphQLID },
    },
    async resolve(_unused: any, { id }: { id: string }) {
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
};

export default regionMutations;
