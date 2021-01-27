import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mongoose, { Schema } from 'mongoose';
import {
  completedPeaks,
  formatDate,
  getLatestAscent,
  RawCompletedCampsite,
  RawCompletedMountain,
  RawCompletedTrail,
} from '../../../utilities/peakListUtils';
import { PeakList as IPeakList } from '../../graphQLTypes';
import {getStatesOrRegion} from '../../Utils';
import CampsiteType from './campsiteType';
import MountainType, {CreatedItemStatus} from './mountainType';
import StateType from './stateType';
import TrailType from './trailType';
import UserType from './userType';

type PeakListSchemaType = mongoose.Document & IPeakList;

export type PeakListModelType = mongoose.Model<PeakListSchemaType> & PeakListSchemaType;

const PeakListSchema = new Schema({
  name: { type: String, required: true },
  shortName: { type: String, required: true },
  description: { type: String },
  optionalPeaksDescription: { type: String },
  type: { type: String, required: true},
  mountains: [{
    type: Schema.Types.ObjectId,
    ref: 'mountain',
  }],
  optionalMountains: [{
    type: Schema.Types.ObjectId,
    ref: 'mountain',
  }],
  trails: [{
    type: Schema.Types.ObjectId,
    ref: 'trail',
  }],
  optionalTrails: [{
    type: Schema.Types.ObjectId,
    ref: 'trail',
  }],
  campsites: [{
    type: Schema.Types.ObjectId,
    ref: 'campsite',
  }],
  optionalCampsites: [{
    type: Schema.Types.ObjectId,
    ref: 'campsite',
  }],
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
  }],
  numUsers: { type: Number, required: true },
  parent: { type: Schema.Types.ObjectId },
  searchString: { type: String, required: true },
  states: [{
    type: Schema.Types.ObjectId,
    ref: 'state',
  }],
  resources: [{
    title: { type: String },
    url: { type: String },
  }],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  status: { type: String },
  flag: { type: String },
  tier: { type: String },
  center: [{type: Number}],
  bbox: [{type: Number}],
  classification:  { type: String },
  privacy: { type: String },
});

export const PeakList: PeakListModelType = mongoose.model<PeakListModelType, any>('list', PeakListSchema);

export const PeakListVariants = new GraphQLEnumType({
  name: 'PeakListVariants',
  values: {
    standard: {
      value: 'standard',
    },
    winter: {
      value: 'winter',
    },
    fourSeason: {
      value: 'fourSeason',
    },
    grid: {
      value: 'grid',
    },
  },
});

export const ExternalResourcesType: any = new GraphQLObjectType({
  name: 'ExternalResourcesType',
  fields: () => ({
    id: { type: GraphQLID },
    title: {
      type: GraphQLString,
    },
    url: {
      type: GraphQLString,
    },
  }),
});

export const PeakListFlag = new GraphQLEnumType({
  name: 'PeakListFlag',
  values: {
    duplicate: {
      value: 'duplicate',
    },
    data: {
      value: 'data',
    },
    abuse: {
      value: 'abuse',
    },
    other: {
      value: 'other',
    },
    deleteRequest: {
      value: 'deleteRequest',
    },
  },
});

export const PeakListTier = new GraphQLEnumType({
  name: 'PeakListTier',
  values: {
    casual: {
      value: 'casual',
    },
    advanced: {
      value: 'advanced',
    },
    expert: {
      value: 'expert',
    },
    mountaineer: {
      value: 'mountaineer',
    },
  },
});

const PeakListType: any = new GraphQLObjectType({
  name:  'PeakListType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    shortName: { type: GraphQLString },
    description: { type: GraphQLString },
    optionalPeaksDescription: { type: GraphQLString },
    type: { type: PeakListVariants },
    privacy: { type: GraphQLString },
    mountains:  {
      type: new GraphQLList(MountainType),
      async resolve(parentValue, args, {dataloaders: {mountainLoader, peakListLoader}}) {
        try {
          if (parentValue.parent) {
            const res = await peakListLoader.load(parentValue.parent);
            if (res && res.mountains && res.mountains.length) {
              return await mountainLoader.loadMany(res.mountains);
            }
          }
          return await mountainLoader.loadMany(parentValue.mountains);
        } catch (err) {
          return err;
        }
      },
    },
    optionalMountains:  {
      type: new GraphQLList(MountainType),
      async resolve(parentValue, args, {dataloaders: {mountainLoader, peakListLoader}}) {
        try {
          if (parentValue.parent) {
            const res = await peakListLoader.load(parentValue.parent);
            if (res && res.optionalMountains && res.optionalMountains.length) {
              return await mountainLoader.loadMany(res.optionalMountains);
            }
          }
          return await mountainLoader.loadMany(parentValue.optionalMountains);
        } catch (err) {
          return err;
        }
      },
    },
    trails:  {
      type: new GraphQLList(TrailType),
      async resolve(parentValue, args, {dataloaders: {trailLoader, peakListLoader}}) {
        try {
          if (parentValue.parent) {
            const res = await peakListLoader.load(parentValue.parent);
            if (res && res.trails && res.trails.length) {
              return await trailLoader.loadMany(res.trails);
            }
          }
          return await trailLoader.loadMany(parentValue.trails);
        } catch (err) {
          return err;
        }
      },
    },
    optionalTrails:  {
      type: new GraphQLList(TrailType),
      async resolve(parentValue, args, {dataloaders: {trailLoader, peakListLoader}}) {
        try {
          if (parentValue.parent) {
            const res = await peakListLoader.load(parentValue.parent);
            if (res && res.optionalTrails && res.optionalTrails.length) {
              return await trailLoader.loadMany(res.optionalTrails);
            }
          }
          return await trailLoader.loadMany(parentValue.optionalTrails);
        } catch (err) {
          return err;
        }
      },
    },
    campsites:  {
      type: new GraphQLList(CampsiteType),
      async resolve(parentValue, args, {dataloaders: {campsiteLoader, peakListLoader}}) {
        try {
          if (parentValue.parent) {
            const res = await peakListLoader.load(parentValue.parent);
            if (res && res.campsites && res.campsites.length) {
              return await campsiteLoader.loadMany(res.campsites);
            }
          }
          return await campsiteLoader.loadMany(parentValue.campsites);
        } catch (err) {
          return err;
        }
      },
    },
    optionalCampsites:  {
      type: new GraphQLList(CampsiteType),
      async resolve(parentValue, args, {dataloaders: {campsiteLoader, peakListLoader}}) {
        try {
          if (parentValue.parent) {
            const res = await peakListLoader.load(parentValue.parent);
            if (res && res.optionalCampsites && res.optionalCampsites.length) {
              return await campsiteLoader.loadMany(res.optionalCampsites);
            }
          }
          return await campsiteLoader.loadMany(parentValue.optionalCampsites);
        } catch (err) {
          return err;
        }
      },
    },
    users:  {
      type: new GraphQLList(UserType),
      async resolve(parentValue, args, {dataloaders: {userLoader}}) {
        try {
          return await userLoader.loadMany(parentValue.users);
        } catch (err) {
          return err;
        }
      },
    },
    numUsers: { type: GraphQLInt },
    parent: {
      type: PeakListType,
      async resolve(parentValue, args, {dataloaders: {peakListLoader}}) {
        if (parentValue.parent) {
          try {
            return await peakListLoader.load(parentValue.parent);
          } catch (err) {
            return err;
          }
        } else {
          return null;
        }
      },
    },
    searchString: { type: GraphQLString },
    states:  {
      type: new GraphQLList(StateType),
      async resolve(parentValue, args, {dataloaders: {stateLoader, peakListLoader}}) {
        try {
          if (parentValue.parent) {
            const res = await peakListLoader.load(parentValue.parent);
            if (res && res.states && res.states.length) {
              return await stateLoader.loadMany(res.states);
            }
          }
          return await stateLoader.loadMany(parentValue.states);
        } catch (err) {
          return err;
        }
      },
    },
    children:  {
      type: new GraphQLList(PeakListType),
      async resolve(parentValue, args, {dataloaders: {peakListLoader}}) {
        try {
          return PeakList.find({ parent: parentValue.id });
        } catch (err) {
          return err;
        }
      },
    },
    siblings:  {
      type: new GraphQLList(PeakListType),
      async resolve(parentValue, args, {dataloaders: {peakListLoader}}) {
        try {
          if (parentValue.parent) {
            return PeakList.find({ parent: parentValue.parent, _id: { $ne: parentValue._id } });
          } else {
            return null;
          }
        } catch (err) {
          return err;
        }
      },
    },
    resources: { type: new GraphQLList(ExternalResourcesType) },
    author: {
      type: UserType,
      async resolve(parentValue, args, {dataloaders: {userLoader}}) {
        try {
          if (parentValue.author) {
            const res = await userLoader.load(parentValue.author);
            if (res._id.toString() !== parentValue.author.toString()) {
              throw new Error('IDs do not match' + res);
            }
            return res;
          } else {
            return null;
          }
        } catch (err) {
          return err;
        }
      },
    },
    status: { type: CreatedItemStatus },
    flag: { type: PeakListFlag },
    tier: { type: PeakListTier },
    numMountains: {
      type: GraphQLInt,
      async resolve(parentValue, args, {dataloaders: {peakListLoader}}) {
        try {
          if (parentValue.mountains && parentValue.mountains.length) {
            return parentValue.mountains.length;
          } else if (parentValue.parent) {
              const res = await peakListLoader.load(parentValue.parent);
              if (res && res.mountains && res.mountains.length) {
                return res.mountains.length;
              } else {
                return 0;
              }
          } else {
            return 0;
          }
        } catch (err) {
          return err;
        }
      },
    },
    numTrails: {
      type: GraphQLInt,
      async resolve(parentValue, args, {dataloaders: {peakListLoader}}) {
        try {
          if (parentValue.trails && parentValue.trails.length) {
            return parentValue.trails.length;
          } else if (parentValue.parent) {
              const res = await peakListLoader.load(parentValue.parent);
              if (res && res.trails && res.trails.length) {
                return res.trails.length;
              } else {
                return 0;
              }
          } else {
            return 0;
          }
        } catch (err) {
          return err;
        }
      },
    },
    numCampsites: {
      type: GraphQLInt,
      async resolve(parentValue, args, {dataloaders: {peakListLoader}}) {
        try {
          if (parentValue.campsites && parentValue.campsites.length) {
            return parentValue.campsites.length;
          } else if (parentValue.parent) {
              const res = await peakListLoader.load(parentValue.parent);
              if (res && res.campsites && res.campsites.length) {
                return res.campsites.length;
              } else {
                return 0;
              }
          } else {
            return 0;
          }
        } catch (err) {
          return err;
        }
      },
    },
    numCompletedAscents: {
      type: GraphQLInt,
      args: {
        userId: {type: GraphQLID },
      },
      async resolve(parentValue, {userId}, {dataloaders: {userLoader, peakListLoader}, user}) {
        if (!user || !user._id) {
          return 0;
        }
        try {
          let completedMountains: RawCompletedMountain[];
          if (!userId || userId.toString() === user._id.toString()) {
            completedMountains = user.mountains.map(({mountain, dates}: RawCompletedMountain) => ({
              mountain: mountain.toString(), dates,
            }));
          } else {
            const res = await userLoader.load(userId);
            if (res && res.mountains && res.mountains.length) {
              completedMountains = res.mountains.map(({mountain, dates}: RawCompletedMountain) => ({
                mountain: mountain.toString(), dates,
              }));
            } else {
              completedMountains = [];
            }
          }

          let mountains: string[];
          if (parentValue.mountains && parentValue.mountains.length) {
            mountains = parentValue.mountains.map((mtn: string) => mtn.toString());
          } else if (parentValue.parent) {
              const res = await peakListLoader.load(parentValue.parent);
              if (res && res.mountains && res.mountains.length) {
                mountains = res.mountains.map((mtn: string) => mtn.toString());
              } else {
                mountains = [];
              }
          } else {
            mountains = [];
          }

          if (completedMountains && completedMountains.length && mountains && mountains.length && parentValue.type) {
            return completedPeaks(mountains, completedMountains, parentValue.type, 'mountain');
          } else {
            return 0;
          }
        } catch (err) {
          return err;
        }
      },
    },
    numCompletedTrips: {
      type: GraphQLInt,
      args: {
        userId: {type: GraphQLID },
      },
      async resolve(parentValue, {userId}, {dataloaders: {userLoader, peakListLoader}, user}) {
        if (!user || !user._id) {
          return 0;
        }
        try {
          let completedMountains: RawCompletedMountain[];
          let completedTrails: RawCompletedTrail[];
          let completedCampsites: RawCompletedCampsite[];
          if (!userId || userId.toString() === user._id.toString()) {
            completedMountains = user.mountains.map(({mountain, dates}: RawCompletedMountain) => ({
              mountain: mountain.toString(), dates,
            }));
            completedTrails = user.trails.map(({trail, dates}: RawCompletedTrail) => ({
              trail: trail.toString(), dates,
            }));
            completedCampsites = user.campsites.map(({campsite, dates}: RawCompletedCampsite) => ({
              campsite: campsite.toString(), dates,
            }));
          } else {
            const res = await userLoader.load(userId);
            if (res && res.mountains && res.mountains.length) {
              completedMountains = res.mountains.map(({mountain, dates}: RawCompletedMountain) => ({
                mountain: mountain.toString(), dates,
              }));
            } else {
              completedMountains = [];
            }
            if (res && res.trails && res.trails.length) {
              completedTrails = res.trails.map(({trail, dates}: RawCompletedTrail) => ({
                trail: trail.toString(), dates,
              }));
            } else {
              completedTrails = [];
            }
            if (res && res.campsites && res.campsites.length) {
              completedCampsites = res.campsites.map(({campsite, dates}: RawCompletedCampsite) => ({
                campsite: campsite.toString(), dates,
              }));
            } else {
              completedCampsites = [];
            }
          }

          let mountains: string[] = [];
          let trails: string[] = [];
          let campsites: string[] = [];
          if (parentValue.mountains && parentValue.mountains.length) {
            mountains = parentValue.mountains.map((mtn: string) => mtn.toString());
          }
          if (parentValue.trails && parentValue.trails.length) {
            trails = parentValue.trails.map((trail: string) => trail.toString());
          }
          if (parentValue.campsites && parentValue.campsites.length) {
            campsites = parentValue.campsites.map((campsite: string) => campsite.toString());
          }

          if (parentValue.parent) {
            const res = await peakListLoader.load(parentValue.parent);
            if (res && res.mountains && res.mountains.length) {
              mountains = res.mountains.map((mtn: string) => mtn.toString());
            } else {
              mountains = [];
            }
            if (res && res.trails && res.trails.length) {
              trails = res.trails.map((trail: string) => trail.toString());
            } else {
              trails = [];
            }
            if (res && res.campsites && res.campsites.length) {
              campsites = res.campsites.map((mtn: string) => mtn.toString());
            } else {
              campsites = [];
            }
          }

          let numberCompletedMountains = 0;
          if (completedMountains && completedMountains.length && mountains && mountains.length && parentValue.type) {
            numberCompletedMountains = completedPeaks(mountains, completedMountains, parentValue.type, 'mountain');
          }
          let numberCompletedTrails = 0;
          if (completedTrails && completedTrails.length && trails && trails.length && parentValue.type) {
            numberCompletedTrails = completedPeaks(trails, completedTrails, parentValue.type, 'trail');
          }
          let numberCompletedCampsites = 0;
          if (completedCampsites && completedCampsites.length && campsites && campsites.length && parentValue.type) {
            numberCompletedCampsites = completedPeaks(campsites, completedCampsites, parentValue.type, 'campsite');
          }
          return numberCompletedMountains + numberCompletedTrails + numberCompletedCampsites;
        } catch (err) {
          return err;
        }
      },
    },
    latestAscent: {
      type: GraphQLString,
      args: {
        userId: {type: GraphQLID },
        raw: {type: GraphQLBoolean},
      },
      async resolve(parentValue, {userId, raw}, {dataloaders: {userLoader, peakListLoader}, user}) {
        if (!user || !user._id) {
          return null;
        }
        try {
          let completedMountains: RawCompletedMountain[];
          if (!userId || userId.toString() === user._id.toString()) {
            completedMountains = user.mountains.map(({mountain, dates}: RawCompletedMountain) => ({
              mountain: mountain.toString(), dates,
            }));
          } else {
            const res = await userLoader.load(userId);
            if (res && res.mountains && res.mountains.length) {
              completedMountains = res.mountains.map(({mountain, dates}: RawCompletedMountain) => ({
                mountain: mountain.toString(), dates,
              }));
            } else {
              completedMountains = [];
            }
          }

          let mountains: string[];
          if (parentValue.mountains && parentValue.mountains.length) {
            mountains = parentValue.mountains.map((mtn: string) => mtn.toString());
          } else if (parentValue.parent) {
              const res = await peakListLoader.load(parentValue.parent);
              if (res && res.mountains && res.mountains.length) {
                mountains = res.mountains.map((mtn: string) => mtn.toString());
              } else {
                mountains = [];
              }
          } else {
            mountains = [];
          }

          if (completedMountains && completedMountains.length && mountains && mountains.length && parentValue.type) {
            const latestDate = getLatestAscent(mountains, completedMountains, parentValue.type, 'mountain');
            if (latestDate !== undefined) {
              if (raw) {
                return latestDate.original;
              }
              return formatDate(latestDate);
            } else {
              return null;
            }
          } else {
            return null;
          }
        } catch (err) {
          return err;
        }
      },
    },
    latestTrip: {
      type: GraphQLString,
      args: {
        userId: {type: GraphQLID },
        raw: {type: GraphQLBoolean},
      },
      async resolve(parentValue, {userId, raw}, {dataloaders: {userLoader, peakListLoader}, user}) {
        if (!user || !user._id) {
          return null;
        }
        try {
          let completedMountains: RawCompletedMountain[];
          let completedTrails: RawCompletedTrail[];
          let completedCampsites: RawCompletedCampsite[];
          if (!userId || userId.toString() === user._id.toString()) {
            completedMountains = user.mountains.map(({mountain, dates}: RawCompletedMountain) => ({
              mountain: mountain.toString(), dates,
            }));
            completedTrails = user.trails.map(({trail, dates}: RawCompletedTrail) => ({
              trail: trail.toString(), dates,
            }));
            completedCampsites = user.campsites.map(({campsite, dates}: RawCompletedCampsite) => ({
              campsite: campsite.toString(), dates,
            }));
          } else {
            const res = await userLoader.load(userId);
            if (res && res.mountains && res.mountains.length) {
              completedMountains = res.mountains.map(({mountain, dates}: RawCompletedMountain) => ({
                mountain: mountain.toString(), dates,
              }));
            } else {
              completedMountains = [];
            }
            if (res && res.trails && res.trails.length) {
              completedTrails = res.trails.map(({trail, dates}: RawCompletedTrail) => ({
                trail: trail.toString(), dates,
              }));
            } else {
              completedTrails = [];
            }
            if (res && res.campsites && res.campsites.length) {
              completedCampsites = res.campsites.map(({campsite, dates}: RawCompletedCampsite) => ({
                campsite: campsite.toString(), dates,
              }));
            } else {
              completedCampsites = [];
            }
          }

          let mountains: string[] = [];
          let trails: string[] = [];
          let campsites: string[] = [];
          if (parentValue.mountains && parentValue.mountains.length) {
            mountains = parentValue.mountains.map((mtn: string) => mtn.toString());
          }
          if (parentValue.trails && parentValue.trails.length) {
            trails = parentValue.trails.map((trail: string) => trail.toString());
          }
          if (parentValue.campsites && parentValue.campsites.length) {
            campsites = parentValue.campsites.map((campsite: string) => campsite.toString());
          }

          if (parentValue.parent) {
            const res = await peakListLoader.load(parentValue.parent);
            if (res && res.mountains && res.mountains.length) {
              mountains = res.mountains.map((mtn: string) => mtn.toString());
            } else {
              mountains = [];
            }
            if (res && res.trails && res.trails.length) {
              trails = res.trails.map((trail: string) => trail.toString());
            } else {
              trails = [];
            }
            if (res && res.campsites && res.campsites.length) {
              campsites = res.campsites.map((mtn: string) => mtn.toString());
            } else {
              campsites = [];
            }
          }

          if (parentValue.type && (
              (completedMountains && completedMountains.length && mountains && mountains.length) ||
              (completedTrails && completedTrails.length && trails && trails.length) ||
              (completedCampsites && completedCampsites.length && campsites && campsites.length)
            )) {
            const latestDate = getLatestAscent(
              [...mountains, ...trails, ...campsites],
              [
                ...completedMountains.map(({mountain, dates}) => ({any: mountain, dates})),
                ...completedTrails.map(({trail, dates}) => ({any: trail, dates})),
                ...completedCampsites.map(({campsite, dates}) => ({any: campsite, dates})),
              ],
              parentValue.type,
              'any',
            );
            if (latestDate !== undefined) {
              if (raw) {
                return latestDate.original;
              }
              return formatDate(latestDate);
            } else {
              return null;
            }
          } else {
            return null;
          }
        } catch (err) {
          return err;
        }
      },
    },
    isActive: {
      type: GraphQLBoolean,
      args: {
        userId: {type: GraphQLID },
      },
      async resolve(parentValue, {userId}, {dataloaders: {userLoader, peakListLoader}, user}) {
        if (!user || !user._id) {
          return null;
        }
        try {
          let userListData: string[];
          if (!userId || userId.toString() === user._id.toString()) {
            userListData = user.peakLists ? user.peakLists : [];
          } else {
            const res = await userLoader.load(userId);
            if (res && res.peakLists && res.peakLists.length) {
              userListData = res.peakLists;
            } else {
              userListData = [];
            }
          }
          return userListData.includes(parentValue._id.toString());
        } catch (err) {
          return err;
        }
      },
    },
    stateOrRegionString: {
      type: GraphQLString,
      args: {
        userId: {type: GraphQLID },
      },
      async resolve(parentValue, {userId}, {dataloaders: {peakListLoader, stateLoader, regionLoader}, user}) {
        try {
          if (parentValue.parent) {
            const res = await peakListLoader.load(parentValue.parent);
            if (res && res.states && res.states.length) {
              const statesData = await stateLoader.loadMany(res.states);
              return getStatesOrRegion(statesData, regionLoader, parentValue._id);
            }
          } else {
            const statesData = await stateLoader.loadMany(parentValue.states);
            return getStatesOrRegion(statesData, regionLoader, parentValue._id);
          }
        } catch (err) {
          return err;
        }
      },
    },
    center: { type: new GraphQLList(GraphQLFloat) },

    bbox:  {
      type: new GraphQLList(GraphQLFloat),
      async resolve(parentValue, args, {dataloaders: {peakListLoader}}) {
        try {
          if (parentValue.parent) {
            const res = await peakListLoader.load(parentValue.parent);
            if (res && res.bbox) {
              return res.bbox;
            }
          }
          return await parentValue.bbox;
        } catch (err) {
          return err;
        }
      },
    },
    classification:  { type: GraphQLString },
  }),
});

export default PeakListType;
