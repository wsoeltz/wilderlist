/* tslint:disable:await-promise */
import { isAdmin, isCorrectUser} from '../../../authorization';
import {
  Coordinate,
  CreatedItemStatus,
  ListPrivacy,
  PeakListTier,
  PeakListVariants,
  PermissionTypes,
  User as IUser,
} from '../../../graphQLTypes';
import {getLocationStrings} from '../../../Utils';
import {
  PeakList,
} from '../../queryTypes/peakListType';

export interface BaseInput {
  id: string;
  name: string;
  shortName: string;
  description: string;
  mountains: string[];
  optionalMountains: string[];
  trails: string[];
  optionalTrails: string[];
  campsites: string[];
  optionalCampsites: string[];
  states: string[];
  resources: Array<{title: string, url: string}>;
  tier: PeakListTier;
  privacy: ListPrivacy;
  center: Coordinate;
  bbox: [number, number, number, number];
}

interface Input extends BaseInput {
  user: IUser | undefined | null;
}

const addEditPeakList = async (input: Input) => {
  const {
    user, id, ...fields
  } = input;

  const searchString = input.name + ' ' + input.shortName;
  const {locationText, locationTextShort} = await getLocationStrings(fields.states, id);

  const doc = await PeakList.findById(id);
  if (doc) {
    const authorObj = doc && doc.author ? doc.author : null;
    if (!(isCorrectUser(user, authorObj) || isAdmin(user))) {
      throw new Error('Invalid user match');
    }
    doc.name = fields.name;
    doc.shortName = fields.shortName;
    doc.description = fields.description;
    doc.mountains = fields.mountains as any;
    doc.optionalMountains = fields.optionalMountains as any;
    doc.trails = fields.trails as any;
    doc.optionalTrails = fields.optionalTrails as any;
    doc.campsites = fields.campsites as any;
    doc.optionalCampsites = fields.optionalCampsites as any;
    doc.states = fields.states as any;
    doc.resources = fields.resources;
    doc.tier = fields.tier;
    doc.privacy = fields.privacy;
    doc.center = fields.center;
    doc.bbox = fields.bbox;
    doc.searchString = searchString;
    doc.locationText = locationText;
    doc.locationTextShort = locationTextShort;
    await doc.save();
    return doc;
  } else if (user) {
    let status: CreatedItemStatus | null;
    if ( (user.peakListPermissions !== null &&
          user.peakListPermissions > 5 ) ||
      user.permissions === PermissionTypes.admin) {
      status = CreatedItemStatus.auto;
    } else if (user.peakListPermissions !== null &&
          user.peakListPermissions === -1) {
      return null;
    } else {
      status = CreatedItemStatus.pending;
    }
    const newPeakList = new PeakList({
      _id: id,
      author: user._id,
      ...fields,
      searchString,
      status,
      numUsers: 0,
      type: PeakListVariants.standard,
      locationText, locationTextShort,
    });
    return newPeakList.save();
  } else {
    throw new Error('Author is missing');
  }
};

export default addEditPeakList;
