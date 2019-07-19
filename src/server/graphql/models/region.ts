import mongoose, { Schema } from 'mongoose';

const RegionSchema = new Schema({
  name: { type: String },
});

mongoose.model('region', RegionSchema);
