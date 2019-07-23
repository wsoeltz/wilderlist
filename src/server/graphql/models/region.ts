import mongoose, { Schema } from 'mongoose';
import { Region } from '../graphQLTypes';

export type RegionSchemaType = mongoose.Document & Region & {
  findStates: (id: string) => any;
};

const RegionSchema: Schema = new Schema({
  name: { type: String },
  states: [{
    type: Schema.Types.ObjectId,
    ref: 'state',
  }],
});

RegionSchema.statics.findStates = function(id: string) {
  return this.findById(id)
    .populate('states')
    .then((region: Region) => region.states);
};

mongoose.model<RegionSchemaType>('region', RegionSchema);
