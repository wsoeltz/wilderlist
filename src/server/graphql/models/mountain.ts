import mongoose, { Schema } from 'mongoose';
import { Mountain } from '../graphQLTypes';

export type MountainSchemaType = mongoose.Document & Mountain & {
  findState: (id: string) => any;
  findLists: (id: string) => any;
};

const MountainSchema = new Schema({
  name: { type: String },
  state: {
    type: Schema.Types.ObjectId,
    ref: 'state',
  },
  lists: [{
    type: Schema.Types.ObjectId,
    ref: 'list',
  }],
});

MountainSchema.statics.findState = function(id: string) {
  return this.findById(id)
    .populate('state')
    .then((mountain: Mountain) => mountain.state);
};

MountainSchema.statics.findLists = function(id: string) {
  return this.findById(id)
    .populate('lists')
    .then((mountain: Mountain) => mountain.lists);
};

mongoose.model('mountain', MountainSchema);
