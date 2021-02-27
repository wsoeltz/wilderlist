export enum CoreItem {
  mountain = 'mountain',
  trail = 'trail',
  campsite = 'campsite',
}

export enum AggregateItem {
  list = 'list',
}

export enum MapItem {
  route = 'route',
  directions = 'directions',
}

export enum CoreItems {
  mountains = 'mountains',
  trails = 'trails',
  campsites = 'campsites',
}

export const coreItemToCoreItems = (item: CoreItem): CoreItems => item + 's' as CoreItems;
export const coreItemsToCoreItem = (item: CoreItems): CoreItem => item.replace('s', '') as CoreItem;

export enum SearchResultType {
  mountain = 'mountain',
  trail = 'trail',
  campsite = 'campsite',
  list = 'list',
  geolocation = 'geolocation',
}
