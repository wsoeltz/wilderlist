// Modified from https://sayasuhendra.github.io/graphql-js/7-using-data-loaders/
// Fixed incorrect IDS with https://github.com/graphql/dataloader/issues/65
import DataLoader from 'dataloader';
import { Mountain } from './graphql/schema/queryTypes/mountainType';
import { PeakList } from './graphql/schema/queryTypes/peakListType';
import { Region } from './graphql/schema/queryTypes/regionType';
import { State } from './graphql/schema/queryTypes/stateType';
import { TripReport } from './graphql/schema/queryTypes/tripReportType';
import { User } from './graphql/schema/queryTypes/userType';

export default () => ({
  stateLoader: new DataLoader(
    async keys => Promise.all(
      keys.map(key => State.findOne({_id: key})),
    ),
    {cacheKeyFn: key => key.toString()},
  ),
  regionLoader: new DataLoader(
    async keys => Promise.all(
      keys.map(key => Region.findOne({_id: key})),
    ),
    {cacheKeyFn: key => key.toString()},
  ),
  mountainLoader: new DataLoader(
    async keys => Promise.all(
      keys.map(key => Mountain.findOne({_id: key})),
    ),
    {cacheKeyFn: key => key.toString()},
  ),
  peakListLoader: new DataLoader(
    async keys => Promise.all(
      keys.map(key => PeakList.findOne({_id: key})),
    ),
    {cacheKeyFn: key => key.toString()},
  ),
  userLoader: new DataLoader(
    async keys => Promise.all(
      keys.map(key => User.findOne({_id: key})),
    ),
    {cacheKeyFn: key => key.toString()},
  ),
  tripReportLoader: new DataLoader(
    async keys => Promise.all(
      keys.map(key => TripReport.findOne({_id: key})),
    ),
    {cacheKeyFn: key => key.toString()},
  ),
});
