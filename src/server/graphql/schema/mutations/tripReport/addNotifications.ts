/* tslint:disable:await-promise */
import {
  sendAscentEmailNotification,
} from '../../../../notifications/email';
import { asyncForEach, formatStringDate } from '../../../Utils';
import {Campsite} from '../../queryTypes/campsiteType';
import {Mountain} from '../../queryTypes/mountainType';
import {Trail} from '../../queryTypes/trailType';
import {User} from '../../queryTypes/userType';

interface AscentNotificationMutationArgs {
  userId: string;
  friendId: string;
  mountainIds: string[];
  trailIds: string[];
  campsiteIds: string[];
  date: string;
}

const addNotifications = async (args: AscentNotificationMutationArgs) => {
  const {
    userId, friendId, mountainIds, date,
    trailIds, campsiteIds,
  } = args;
  try {
    const friend = await User.findOne({ _id: friendId });
    const mountainList: string[] = [];
    if (mountainIds && mountainIds.length) {
      await asyncForEach(mountainIds, async (mountainId: string) => {
        if (friend) {
          const completedMountain = friend && friend.mountains ?
            friend.mountains.find((mtn: any) => {
              return (mtn.mountain.toString() === mountainId);
            }) : undefined;
          const dateAlreadyExists = completedMountain
            ? completedMountain.dates.find(d => d === date) : undefined;
          if (!dateAlreadyExists) {
            await User.findOneAndUpdate({
              _id: friendId,
              $or: [
                {'ascentNotifications.user': { $ne: userId }},
                {'ascentNotifications.mountain': { $ne: mountainId }},
                {'ascentNotifications.date': { $ne: date }},
              ],
            }, {
              $push: { ascentNotifications: {
                user: userId, mountain: mountainId, date,
              } },
            });
            const mountain = await Mountain.findOne({_id: mountainId});
            if (mountain) {
              mountainList.push(mountain.name);
            }
          }
        }
      });
    }
    const trailList: string[] = [];
    if (trailIds && trailIds.length) {
      await asyncForEach(trailIds, async (trailId: string) => {
        if (friend) {
          const completedTrail = friend && friend.trails ?
            friend.trails.find((mtn: any) => {
              return (mtn.trail.toString() === trailId);
            }) : undefined;
          const dateAlreadyExists = completedTrail
            ? completedTrail.dates.find(d => d === date) : undefined;
          if (!dateAlreadyExists) {
            await User.findOneAndUpdate({
              _id: friendId,
              $or: [
                {'trailNotifications.user': { $ne: userId }},
                {'trailNotifications.trail': { $ne: trailId }},
                {'trailNotifications.date': { $ne: date }},
              ],
            }, {
              $push: { trailNotifications: {
                user: userId, trail: trailId, date,
              } },
            });
            const trail = await Trail.findOne({_id: trailId});
            if (trail && trail.name) {
              trailList.push(trail.name);
            }
          }
        }
      });
    }
    const campsiteList: string[] = [];
    if (campsiteIds && campsiteIds.length) {
      await asyncForEach(campsiteIds, async (campsiteId: string) => {
        if (friend) {
          const completedCampsite = friend && friend.campsites ?
            friend.campsites.find((mtn: any) => {
              return (mtn.campsite.toString() === campsiteId);
            }) : undefined;
          const dateAlreadyExists = completedCampsite
            ? completedCampsite.dates.find(d => d === date) : undefined;
          if (!dateAlreadyExists) {
            await User.findOneAndUpdate({
              _id: friendId,
              $or: [
                {'campsiteNotifications.user': { $ne: userId }},
                {'campsiteNotifications.campsite': { $ne: campsiteId }},
                {'campsiteNotifications.date': { $ne: date }},
              ],
            }, {
              $push: { campsiteNotifications: {
                user: userId, campsite: campsiteId, date,
              } },
            });
            const campsite = await Campsite.findOne({_id: campsiteId});
            if (campsite && campsite.name) {
              campsiteList.push(campsite.name);
            }
          }
        }
      });
    }
    const me = await User.findOne({_id: userId});
    const allNames = [...mountainList];
    if (me && friend && allNames.length &&
        !friend.disableEmailNotifications && friend.email) {
      let mountainNames: string;
      if (allNames.length === 1) {
        mountainNames = allNames[0];
      } else if (allNames.length === 2) {
        mountainNames = `${allNames[0]} and ${allNames[1]}`;
      } else {
        mountainNames = '';
        allNames.forEach((mtn, i) => {
          if (i === allNames.length - 2) {
            mountainNames += mtn + ' and ';
          } else if (i === allNames.length - 1) {
            mountainNames += mtn;
          } else {
            mountainNames += mtn + ', ';
          }
        });
      }
      sendAscentEmailNotification({
        mountainName: mountainNames,
        user: me.name,
        userEmail: friend.email,
        date: formatStringDate(date),
      });
    }
    return await User.findOne({_id: friendId});
  } catch (err) {
    return err;
  }
};

export default addNotifications;
