import mongoose, { Schema } from 'mongoose';
import { Mountain } from '../graphQLTypes';

const MountainSchema = new Schema({
  name: { type: String },
  state: {
    type: Schema.Types.ObjectId,
    ref: 'state',
  },
});

MountainSchema.statics.findState = function(id: string) {
  return this.findById(id)
    .populate('state')
    .then((mountain: Mountain) => mountain.state);
};

mongoose.model('mountain', MountainSchema);
