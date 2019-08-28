import { Routes } from './routes';

export const listDetailLink = ((id: string) => Routes.ListDetail.replace(':id', id));
