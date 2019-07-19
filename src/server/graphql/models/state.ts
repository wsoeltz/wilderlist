import mongoose, { Schema } from 'mongoose';
import { State } from '../graphQLTypes';

const StateSchema = new Schema({
  name: { type: String },
  regions: [{
    type: Schema.Types.ObjectId,
    ref: 'region',
  }],
});

StateSchema.statics.findRegion = function(id: string) {
  return this.findById(id)
    .populate('regions')
    .then((state: State) => state.regions);
};

mongoose.model('state', StateSchema);
