import mongoose, { Schema } from 'mongoose';
import { User } from '../graphQLTypes';

export type UserSchemaType = mongoose.Document & User & {
  findFriends: (id: string) => any;
  findLists: (id: string) => any;
};

const UserSchema = new Schema({
  name: { type: String },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
  }],
  lists: [{
    type: Schema.Types.ObjectId,
    ref: 'list',
  }],
});

UserSchema.statics.findFriends = function(id: string) {
  return this.findById(id)
    .populate('friends')
    .then((user: User) => user.friends);
};

UserSchema.statics.findLists = function(id: string) {
  return this.findById(id)
    .populate('lists')
    .then((user: User) => user.lists);
};

mongoose.model('user', UserSchema);
