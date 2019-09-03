import { Routes } from './routes';

export const listDetailLink = ((id: string) => Routes.ListDetail.replace(':id', id));
export const mountainDetailLink = ((id: string) => Routes.MountainDetail.replace(':id', id));
