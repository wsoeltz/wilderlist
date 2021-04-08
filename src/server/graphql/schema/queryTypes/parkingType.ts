import mongoose, { Schema } from 'mongoose';
import { Parking as IParking } from '../../graphQLTypes';

type ParkingSchemaType = mongoose.Document & IParking & {
  findState: (id: string) => any;
  findPeakLists: (id: string) => any;
};

export type ParkingModelType = mongoose.Model<ParkingSchemaType> & ParkingSchemaType;

const ParkingSchema = new Schema({
  name: { type: String },
  osmId: { type: String },
  type: { type: String },
  location: [{type: Number}],
});

ParkingSchema.index({ location: '2dsphere' });

export const Parking: ParkingModelType = mongoose.model<ParkingModelType, any>('parking', ParkingSchema, 'parking');
