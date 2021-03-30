export enum CoreItem {
  mountain = 'mountain',
  trail = 'trail',
  campsite = 'campsite',
}

export enum AggregateItem {
  list = 'list',
}

export enum AutoItem {
  route = 'route',
}

export enum MapItem {
  route = 'route',
  directions = 'directions',
  vehicleRoad = 'vehicle_road',
}

export enum CoreItems {
  mountains = 'mountains',
  trails = 'trails',
  campsites = 'campsites',
}

export const coreItemToCoreItems = (item: CoreItem): CoreItems => item + 's' as CoreItems;
export const coreItemsToCoreItem = (item: CoreItems): CoreItem => item.slice(0, item.length - 1) as CoreItem;

export enum SearchResultType {
  mountain = 'mountain',
  trail = 'trail',
  campsite = 'campsite',
  list = 'list',
  geolocation = 'geolocation',
}
