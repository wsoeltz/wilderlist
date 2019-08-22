// https://sayasuhendra.github.io/graphql-js/7-using-data-loaders/
import DataLoader from 'dataloader';

// 1
async function batchState(Model: any, keys: any) {
  return await Model.find({_id: {$in: keys}}).exec();
}

// 2
export default ({State, Region, Mountain, PeakList, User}:
  {State: any, Region: any, Mountain: any, PeakList: any, User: any}) => ({
  // 3
  stateLoader: new DataLoader(
    keys => batchState(State, keys),
    {cacheKeyFn: key => key.toString()},
  ),
  regionLoader: new DataLoader(
    keys => batchState(Region, keys),
    {cacheKeyFn: key => key.toString()},
  ),
  mountainLoader: new DataLoader(
    keys => batchState(Mountain, keys),
    {cacheKeyFn: key => key.toString()},
  ),
  peakListLoader: new DataLoader(
    keys => batchState(PeakList, keys),
    {cacheKeyFn: key => key.toString()},
  ),
  userLoader: new DataLoader(
    keys => batchState(User, keys),
    {cacheKeyFn: key => key.toString()},
  ),
});
