import mongoose, { Schema } from 'mongoose';
import { List } from '../graphQLTypes';

const ListSchema = new Schema({
  name: { type: String },
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'mountain',
  }],
});

ListSchema.statics.findMountain = function(id: string) {
  return this.findById(id)
    .populate('items')
    .then((list: List) => list.items);
};

mongoose.model('list', ListSchema);
