//   /lib/models/crmModel.ts
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const IoTHostStatusSchema = new Schema({}, {collection: 'IoT-Host-list'});
