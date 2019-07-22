import mongoose, { Schema } from 'mongoose';
import { State } from '../graphQLTypes';

const StateSchema = new Schema({
  name: { type: String },
  regions: [{
    type: Schema.Types.ObjectId,
    ref: 'region',
  }],
  mountains: [{
    type: Schema.Types.ObjectId,
    ref: 'mountain',
  }],
});

StateSchema.statics.findRegions = function(id: string) {
  return this.findById(id)
    .populate('regions')
    .then((state: State) => state.regions);
};

StateSchema.statics.findMountains = function(id: string) {
  return this.findById(id)
    .populate('mountains')
    .then((state: State) => state.mountains);
};

mongoose.model('state', StateSchema);
