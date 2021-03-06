/* tslint:disable:await-promise */
import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { isAdmin, isLoggedIn } from '../../authorization';
import {
  TrailType as TrailTypeEnum,
  User as IUser,
} from '../../graphQLTypes';
import { asyncForEach, getLocationStrings, removeConnections, removeItemFromAllLists } from '../../Utils';
import TrailType, {
  Trail,
} from '../queryTypes/trailType';

interface UpdateInput {
  id: string;
  name: string | null;
  type: TrailTypeEnum;
  waterCrossing: string | null;
  allowsBikes: boolean | null;
  allowsHorses: boolean | null;
  skiTrail: boolean | null;
}

interface UpdateParentInput {
  id: string;
  name: string;
  children: string[];
  bbox: [number, number, number, number];
  states: string[];
  trailLength: number;
}

const trailMutations: any = {
  updateTrail: {
    type: TrailType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLString },
      type: { type: GraphQLNonNull(GraphQLString) },
      waterCrossing: { type: GraphQLString },
      allowsBikes: { type: GraphQLBoolean },
      allowsHorses: { type: GraphQLBoolean },
      skiTrail: { type: GraphQLBoolean },
    },
    async resolve(_unused: any, input: UpdateInput, {user}: {user: IUser | undefined | null}) {
      const {
        id, ...rest
      } = input;
      try {
        const trail = await Trail.findById(id);
        if (!isAdmin(user)) {
          throw new Error('Invalid user match');
        }
        if (trail !== null) {
          const fields: any = {...rest};
          const newTrail = await Trail.findOneAndUpdate(
            {_id: id},
            fields,
            {new: true});
          return newTrail;
        }
      } catch (err) {
        return err;
      }
    },
  },
  updateParentRouteTrail: {
    type: TrailType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLNonNull(GraphQLString) },
      children: { type: new GraphQLList(GraphQLID)},
      bbox: {type: GraphQLNonNull(new GraphQLList(GraphQLFloat))},
      states: { type: new GraphQLList(GraphQLID)},
      trailLength: { type: GraphQLNonNull(GraphQLFloat) },
    },
    async resolve(_unused: any, input: UpdateParentInput, {user}: {user: IUser | undefined | null}) {
      const {
        id, children, states, ...rest
      } = input;
      try {
        const trail = await Trail.findById(id);
        if (!isAdmin(user)) {
          throw new Error('Invalid user match');
        }
        if (trail !== null) {
          await removeConnections(Trail, id, 'children', Trail, 'parents');
          const {locationText, locationTextShort} = await getLocationStrings(states, id);
          const newTrail = await Trail.findOneAndUpdate(
            {_id: id},
            {children, locationText, locationTextShort, ...rest},
            {new: true});
          if (children && children.length) {
            await asyncForEach(children, async (childId: string) =>
              await Trail.findByIdAndUpdate(childId, { $push: {parents: id} }));
          }
          return newTrail;
        }
      } catch (err) {
        return err;
      }
    },
  },
  deleteTrail: {
    type: TrailType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, { id }: { id: string }, {user}: {user: IUser | undefined | null}) {
      if (!isAdmin(user)) {
        throw new Error('Invalid permission');
      }
      try {
        await removeItemFromAllLists(id, 'trails');
        await removeConnections(Trail, id, 'parents', Trail, 'children');
        await removeConnections(Trail, id, 'children', Trail, 'parents');
        return Trail.findByIdAndDelete(id);
      } catch (err) {
        return err;
      }
    },
  },
  updateTrailFlag: {
    type: TrailType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      flag: { type: GraphQLString },
    },
    async resolve(_unused: any,
                  { id, flag }: { id: string , flag: string | null},
                  {dataloaders, user}: {dataloaders: any, user: IUser | undefined | null}) {
      if (!isLoggedIn(user)) {
        throw new Error('You must be logged in');
      }
      try {
        const flagWithAuthor = user && flag && flag
          ? flag + '__USERID__' + user._id + '__USERNAME__' + user.name
          : flag;
        const trail = await Trail.findOneAndUpdate(
        { _id: id },
        { flag: flagWithAuthor },
        {new: true});
        dataloaders.trailLoader.clear(id).prime(id, trail);
        return trail;
      } catch (err) {
        return err;
      }
    },
  },
};

export default trailMutations;
