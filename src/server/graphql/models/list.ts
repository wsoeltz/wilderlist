import mongoose, { Schema } from 'mongoose';
import { List } from '../graphQLTypes';

const ListSchema = new Schema({
  name: { type: String },
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'mountain',
  }],
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
  }],
});

ListSchema.statics.findMountains = function(id: string) {
  return this.findById(id)
    .populate('items')
    .then((list: List) => list.items);
};

ListSchema.statics.findUsers = function(id: string) {
  return this.findById(id)
    .populate('users')
    .then((list: List) => list.users);
};

mongoose.model('list', ListSchema);
