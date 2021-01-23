/* tslint:disable:await-promise */
import mongoose from 'mongoose';
import {
  TripReport as ITripReport,
} from '../../../graphQLTypes';
import {DateType, getDateType, parseDate} from '../../../Utils';
import {TripReport} from '../../queryTypes/tripReportType';
import {UserSchemaType} from '../../queryTypes/userType';
import addNotifications from './addNotifications';

export interface Input extends ITripReport {
  authorDoc: UserSchemaType;
  originalDate: string | null;
  originalMountains: string[]; // includes both original mountains and new mountains
  originalTrails: string[]; // includes both original trails and new trails
  originalCampsites: string[]; // includes both original campsites and new campsites
}

interface UpdateCompletionFieldInput {
  items: any[];
  field: string;
  dropArray: string[];
  originalDate: string | null;
  addArray: string[];
  newDate: string | null;
}

const updateCompletionField = (input: UpdateCompletionFieldInput): any[] => {
  const {
    items, field, dropArray, originalDate, addArray, newDate,
  } = input;
  // Create modified version of array with added/removed dates
  const modifiedItems = items.map(m => {
    // create initial output to be identical to input
    const out = {
      _id: m._id,
      [field]: m[field],
      dates: m.dates,
    };
    // if this is an original item, drop any dates that match the original date
    if (m[field] && dropArray.find(id => id.toString() === (m[field] as unknown as string).toString())) {
      out.dates = m.dates.filter((d: string) => d !== originalDate);
    }
    // if this is a new item, add the newDate if it does not already exist
    if (m[field] &&
        addArray.find(id => id.toString() === (m[field] as unknown as string).toString()) &&
        !out.dates.find((d: string) => d === newDate)
      ) {
      out.dates.push(newDate);
    }
    return out;
  });
  // Create new objects for completed items that did not previously exist
  const newItems = addArray.filter(id => !modifiedItems.find(
    m => id.toString() === (m[field] as unknown as string).toString())).map(id => ({
    _id: mongoose.Types.ObjectId(),
    [field]: mongoose.Types.ObjectId(id),
    dates: [newDate],
  }));
  modifiedItems.push(...newItems);
  // Cleanup and filter out any items that no longer have any dates associated with them
  const filteredItems = modifiedItems.filter(m => m.dates.length);
  return filteredItems;
};

interface ClearNotificationsInput {
  notifications: any[];
  items: string[];
  field: string;
  dates: Array<string | null>;
}

const cleanedNotifications = ({notifications, field, items, dates}: ClearNotificationsInput): any[] =>
    notifications.filter(m =>
      !(items.find(i => i.toString() === m[field].toString()) && dates.find(d => d === m.date)));

const conditionsExist = (input: ITripReport) => {
  const {
    mountains, trails, campsites, parent, users, notes, link,
    mudMinor, mudMajor, waterSlipperyRocks, waterOnTrail, leavesSlippery,
    iceBlack, iceBlue, iceCrust, snowIceFrozenGranular, snowIceMonorailStable,
    snowIceMonorailUnstable, snowIcePostholes, snowMinor, snowPackedPowder,
    snowUnpackedPowder, snowDrifts, snowSticky, snowSlush, obstaclesBlowdown,
    obstaclesOther,
  } = input;
  return (
    (mountains && mountains.length > 1) || (trails && trails.length > 1) ||
    (campsites && campsites.length > 1) || (users && users.length > 0) || notes || link ||
    mudMinor || mudMajor || waterSlipperyRocks || waterOnTrail || leavesSlippery ||
    iceBlack || iceBlue || iceCrust || snowIceFrozenGranular || snowIceMonorailStable ||
    snowIceMonorailUnstable || snowIcePostholes || snowMinor || snowPackedPowder ||
    snowUnpackedPowder || snowDrifts || snowSticky || snowSlush || obstaclesBlowdown ||
    obstaclesOther || parent
  );
};

const addEditTripReport = async (input: Input) => {
  const {
    id, authorDoc, author, users,
    originalDate,
    originalMountains, mountains: newMountainStringIds,
    originalTrails, trails: newTrailStringIds,
    originalCampsites, campsites: newCampsiteStringIds,
    date,
  } = input;
  const mountains = newMountainStringIds as unknown as string[];
  const trails = newTrailStringIds as unknown as string[];
  const campsites = newCampsiteStringIds as unknown as string[];
  // 1 Fetch the author (will be included in the input as authorDoc)
  // 2 From the author, remove originalDate for ORIGINAL m, t, c (diff between all and new)
  // 3 From the author, add completionDate for all NEW m, t, c
  authorDoc.mountains = updateCompletionField({
    items: authorDoc.mountains ? authorDoc.mountains : [],
    field: 'mountain',
    dropArray: originalMountains, originalDate,
    addArray: mountains, newDate: date,
  });
  authorDoc.trails = updateCompletionField({
    items: authorDoc.trails ? authorDoc.trails : [],
    field: 'trail',
    dropArray: originalTrails, originalDate,
    addArray: trails, newDate: date,
  });
  authorDoc.campsites = updateCompletionField({
    items: authorDoc.campsites ? authorDoc.campsites : [],
    field: 'campsite',
    dropArray: originalCampsites, originalDate,
    addArray: campsites, newDate: date,
  });
  // 4 From the author, remove all notifications for ALL m,t,c for both originalDate and completionDate
  if (authorDoc.ascentNotifications && authorDoc.ascentNotifications.length) {
    authorDoc.ascentNotifications = cleanedNotifications({
      notifications: authorDoc.ascentNotifications,
      items: mountains,
      field: 'mountain',
      dates: [date, originalDate],
    });
  }
  if (authorDoc.trailNotifications && authorDoc.trailNotifications.length) {
    authorDoc.trailNotifications = cleanedNotifications({
      notifications: authorDoc.trailNotifications,
      items: trails,
      field: 'trail',
      dates: [date, originalDate],
    });
  }
  if (authorDoc.campsiteNotifications && authorDoc.campsiteNotifications.length) {
    authorDoc.campsiteNotifications = cleanedNotifications({
      notifications: authorDoc.campsiteNotifications,
      items: campsites,
      field: 'campsite',
      dates: [date, originalDate],
    });
  }
  // 5 Save author doc
  authorDoc.save();

  // 1 Fetch all users that aren't the author
  const friends = users.filter(friendId => friendId !== author) as unknown as string[];
  if (friends.length) {
    friends.forEach(friend => addNotifications({
      userId: authorDoc._id,
      friendId: friend,
      mountainIds: mountains,
      trailIds: trails,
      campsiteIds: campsites,
      date,
    }));
  }

  // 1 Attempt to fetch tripReport by id OR originalDate && author && items
  let item: any = {};
  if (mountains && mountains.length) {
    item = {mountains};
  }
  if (trails && trails.length) {
    item = {trails};
  }
  if (campsites && campsites.length) {
    item = {campsites};
  }
  const tripReportDoc = await TripReport.findOne({$or: [
      { _id: id },
      { date: originalDate, author, ...item },
    ],
  });
  // 2 If it exists:
  if (tripReportDoc) {
    if (getDateType(parseDate(date)) !== DateType.full) {
      // 1 If new date is not a full date
      // delete the report
      await TripReport.deleteMany({$or: [
          { _id: id },
          { date: originalDate, author, ...item },
        ],
      });
      return null;
    } else {
      // 2 else tripReport exists and with valid date
      // delete any other trip reports that exist with the same date for the same items
      await TripReport.deleteMany(
        { _id: {$ne: id}, date, author, ...item },
      );
      // Replace all contents of tripReport with new input
      // Save tripReport doc
      if (conditionsExist(input)) {
        tripReportDoc.date = date;
        tripReportDoc.parent = input.parent ? input.parent : null;
        tripReportDoc.author = input.author ? input.author : null;
        tripReportDoc.mountains = input.mountains ? input.mountains : [];
        tripReportDoc.trails = input.trails ? input.trails : [];
        tripReportDoc.campsites = input.campsites ? input.campsites : [];
        tripReportDoc.users = input.users ? input.users : [];
        tripReportDoc.notes = input.notes ? input.notes : null;
        tripReportDoc.link = input.link ? input.link : null;
        tripReportDoc.privacy = input.privacy ? input.privacy : null;
        tripReportDoc.mudMinor = input.mudMinor ? input.mudMinor : null;
        tripReportDoc.mudMajor = input.mudMajor ? input.mudMajor : null;
        tripReportDoc.waterSlipperyRocks = input.waterSlipperyRocks ? input.waterSlipperyRocks : null;
        tripReportDoc.waterOnTrail = input.waterOnTrail ? input.waterOnTrail : null;
        tripReportDoc.leavesSlippery = input.leavesSlippery ? input.leavesSlippery : null;
        tripReportDoc.iceBlack = input.iceBlack ? input.iceBlack : null;
        tripReportDoc.iceBlue = input.iceBlue ? input.iceBlue : null;
        tripReportDoc.iceCrust = input.iceCrust ? input.iceCrust : null;
        tripReportDoc.snowIceFrozenGranular = input.snowIceFrozenGranular ? input.snowIceFrozenGranular : null;
        tripReportDoc.snowIceMonorailStable = input.snowIceMonorailStable ? input.snowIceMonorailStable : null;
        tripReportDoc.snowIceMonorailUnstable = input.snowIceMonorailUnstable ? input.snowIceMonorailUnstable : null;
        tripReportDoc.snowIcePostholes = input.snowIcePostholes ? input.snowIcePostholes : null;
        tripReportDoc.snowMinor = input.snowMinor ? input.snowMinor : null;
        tripReportDoc.snowPackedPowder = input.snowPackedPowder ? input.snowPackedPowder : null;
        tripReportDoc.snowUnpackedPowder = input.snowUnpackedPowder ? input.snowUnpackedPowder : null;
        tripReportDoc.snowDrifts = input.snowDrifts ? input.snowDrifts : null;
        tripReportDoc.snowSticky = input.snowSticky ? input.snowSticky : null;
        tripReportDoc.snowSlush = input.snowSlush ? input.snowSlush : null;
        tripReportDoc.obstaclesBlowdown = input.obstaclesBlowdown ? input.obstaclesBlowdown : null;
        tripReportDoc.obstaclesOther = input.obstaclesOther ? input.obstaclesOther : null;

        tripReportDoc.save();
        return tripReportDoc;
      } else {
        await TripReport.deleteOne({_id: tripReportDoc._id});
        return null;
      }
    }
  } else {
    // 3 else the report does not exist
    // delete any other trip reports that exist with the same date for the same items
      await TripReport.deleteMany(
        { _id: {$ne: id}, date, author, ...item },
      );
    // Create and save a new report with input
      const newTripReport = new TripReport({
      date,
      parent: input.parent ? input.parent : null,
      author: input.author ? input.author : null,
      mountains: input.mountains ? input.mountains : [],
      trails: input.trails ? input.trails : [],
      campsites: input.campsites ? input.campsites : [],
      users: input.users ? input.users : [],
      notes: input.notes ? input.notes : null,
      link: input.link ? input.link : null,
      privacy: input.privacy ? input.privacy : null,
      mudMinor: input.mudMinor ? input.mudMinor : null,
      mudMajor: input.mudMajor ? input.mudMajor : null,
      waterSlipperyRocks: input.waterSlipperyRocks ? input.waterSlipperyRocks : null,
      waterOnTrail: input.waterOnTrail ? input.waterOnTrail : null,
      leavesSlippery: input.leavesSlippery ? input.leavesSlippery : null,
      iceBlack: input.iceBlack ? input.iceBlack : null,
      iceBlue: input.iceBlue ? input.iceBlue : null,
      iceCrust: input.iceCrust ? input.iceCrust : null,
      snowIceFrozenGranular: input.snowIceFrozenGranular ? input.snowIceFrozenGranular : null,
      snowIceMonorailStable: input.snowIceMonorailStable ? input.snowIceMonorailStable : null,
      snowIceMonorailUnstable: input.snowIceMonorailUnstable ? input.snowIceMonorailUnstable : null,
      snowIcePostholes: input.snowIcePostholes ? input.snowIcePostholes : null,
      snowMinor: input.snowMinor ? input.snowMinor : null,
      snowPackedPowder: input.snowPackedPowder ? input.snowPackedPowder : null,
      snowUnpackedPowder: input.snowUnpackedPowder ? input.snowUnpackedPowder : null,
      snowDrifts: input.snowDrifts ? input.snowDrifts : null,
      snowSticky: input.snowSticky ? input.snowSticky : null,
      snowSlush: input.snowSlush ? input.snowSlush : null,
      obstaclesBlowdown: input.obstaclesBlowdown ? input.obstaclesBlowdown : null,
      obstaclesOther: input.obstaclesOther ? input.obstaclesOther : null,
    });
      return newTripReport.save();
  }

};

export default addEditTripReport;
