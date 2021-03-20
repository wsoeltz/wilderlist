/* tslint:disable:await-promise */
import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { isAdmin, isCorrectUser, isLoggedIn } from '../../authorization';
import {
  CampsiteOwnership,
  CampsiteReservation,
  CampsiteType as CampsiteTypeEnum,
  CreatedItemStatus as CreatedItemStatusEnum,
  PermissionTypes,
  User as IUser,
} from '../../graphQLTypes';
import { removeConnections } from '../../Utils';
import CampsiteType, {
  Campsite,
} from '../queryTypes/campsiteType';
import {
  CreatedItemStatus,
} from '../queryTypes/mountainType';
import { PeakList } from '../queryTypes/peakListType';
import {User} from '../queryTypes/userType';

interface CoreInput {
  name: string | null;
  type: CampsiteTypeEnum;
  latitude: number;
  longitude: number;
  elevation: number;
  state: string;
  locationText: string;
  locationTextShort: string;
  author: string;
}

interface OptionalInput {
  website: string | null;
  ownership: CampsiteOwnership | null;
  electricity: boolean | null;
  toilets: boolean | null;
  drinking_water: boolean | null;
  email: string | null;
  reservation: CampsiteReservation | string | null;
  showers: boolean | null;
  phone: string | null;
  fee: boolean | null;
  tents: boolean | null;
  capacity: number | null;
  internet_access: boolean | null;
  fire: boolean | null;
  maxtents: number | null;
}

type AddInput = CoreInput & OptionalInput;
type UpdateInput = CoreInput & OptionalInput & {id: string};

const campsiteMutations: any = {
  addCampsite: {
    type: CampsiteType,
    args: {
      name: { type: GraphQLString },
      type: { type: GraphQLNonNull(GraphQLString) },
      latitude: { type: GraphQLNonNull(GraphQLFloat) },
      longitude: { type: GraphQLNonNull(GraphQLFloat) },
      elevation: { type: GraphQLNonNull(GraphQLFloat) },
      state: { type: GraphQLNonNull(GraphQLID) },
      locationText: { type: GraphQLNonNull(GraphQLString) },
      locationTextShort: { type: GraphQLNonNull(GraphQLString) },
      author: { type: GraphQLNonNull(GraphQLID) },
      website: { type: GraphQLString },
      ownership: { type: GraphQLString },
      electricity: { type: GraphQLBoolean },
      toilets: { type: GraphQLBoolean },
      drinking_water: { type: GraphQLBoolean },
      email: { type: GraphQLString },
      reservation: { type: GraphQLString },
      showers: { type: GraphQLBoolean },
      phone: { type: GraphQLString },
      fee: { type: GraphQLBoolean },
      tents: { type: GraphQLBoolean },
      capacity: { type: GraphQLInt },
      internet_access: { type: GraphQLBoolean },
      fire: { type: GraphQLBoolean },
      maxtents: { type: GraphQLInt },
    },
    async resolve(_unused: any, input: AddInput, {user}: {user: IUser | undefined | null}) {
      const {
        latitude, longitude, author, ...rest
      } = input;
      const authorObj = await User.findById(author);
      if (!isCorrectUser(user, authorObj)) {
        throw new Error('Invalid user match');
      }
      let status: CreatedItemStatusEnum | null;
      if (!authorObj) {
        status = null;
      } else if ( (authorObj.campsitePermissions !== null &&
            authorObj.campsitePermissions > 5 ) ||
        authorObj.permissions === PermissionTypes.admin) {
        status = CreatedItemStatusEnum.auto;
      } else if (authorObj.campsitePermissions !== null &&
            authorObj.campsitePermissions === -1) {
        return null;
      } else {
        status = CreatedItemStatusEnum.pending;
      }
      const newCampsite = new Campsite({
        author, status, location: [longitude, latitude], ...rest,
      });
      try {
        return newCampsite.save();
      } catch (err) {
        return err;
      }
    },
  },
  updateCampsite: {
    type: CampsiteType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLString },
      type: { type: GraphQLNonNull(GraphQLString) },
      latitude: { type: GraphQLNonNull(GraphQLFloat) },
      longitude: { type: GraphQLNonNull(GraphQLFloat) },
      elevation: { type: GraphQLNonNull(GraphQLFloat) },
      state: { type: GraphQLNonNull(GraphQLID) },
      locationText: { type: GraphQLNonNull(GraphQLString) },
      locationTextShort: { type: GraphQLNonNull(GraphQLString) },
      website: { type: GraphQLString },
      ownership: { type: GraphQLString },
      electricity: { type: GraphQLBoolean },
      toilets: { type: GraphQLBoolean },
      drinking_water: { type: GraphQLBoolean },
      email: { type: GraphQLString },
      reservation: { type: GraphQLString },
      showers: { type: GraphQLBoolean },
      phone: { type: GraphQLString },
      fee: { type: GraphQLBoolean },
      tents: { type: GraphQLBoolean },
      capacity: { type: GraphQLInt },
      internet_access: { type: GraphQLBoolean },
      fire: { type: GraphQLBoolean },
      maxtents: { type: GraphQLInt },
    },
    async resolve(_unused: any, input: UpdateInput, {user}: {user: IUser | undefined | null}) {
      const {
        id, latitude, longitude, author, ...rest
      } = input;
      try {
        const campsite = await Campsite.findById(id);
        const authorObj = campsite && campsite.author ? campsite.author : null;
        if (!(isCorrectUser(user, authorObj) || isAdmin(user))) {
          throw new Error('Invalid user match');
        }
        if (campsite !== null) {
          const newCampsite = await Campsite.findOneAndUpdate({
              _id: id,
            },
            { location: [longitude, latitude], ...rest },
            {new: true});
          return newCampsite;
        }
      } catch (err) {
        return err;
      }
    },
  },
  deleteCampsite: {
    type: CampsiteType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
    async resolve(_unused: any, { id }: { id: string }, {user}: {user: IUser | undefined | null}) {
      if (!isAdmin(user)) {
        throw new Error('Invalid permission');
      }
      try {
        await removeConnections(Campsite, id, 'lists', PeakList, 'campsites');
        return Campsite.findByIdAndDelete(id);
      } catch (err) {
        return err;
      }
    },
  },
  updateCampsiteStatus: {
    type: CampsiteType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      status: { type: CreatedItemStatus },
    },
    async resolve(_unused: any,
                  { id, status }: { id: string , status: CreatedItemStatusEnum | null},
                  {dataloaders, user}: {dataloaders: any, user: IUser | undefined | null}) {
      if (!isAdmin(user)) {
        throw new Error('Invalid permission');
      }
      try {
        const campsite = await Campsite.findOneAndUpdate(
        { _id: id },
        { status },
        {new: true});
        dataloaders.campsiteLoader.clear(id).prime(id, campsite);
        return campsite;
      } catch (err) {
        return err;
      }
    },
  },
  updateCampsiteFlag: {
    type: CampsiteType,
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
        const flagWithAuthor = user && flag
          ? flag + '__USERID__' + user._id + '__USERNAME__' + user.name
          : flag;
        const campsite = await Campsite.findOneAndUpdate(
        { _id: id },
        { flag: flagWithAuthor },
        {new: true});
        dataloaders.campsiteLoader.clear(id).prime(id, campsite);
        return campsite;
      } catch (err) {
        return err;
      }
    },
  },
};

export default campsiteMutations;
