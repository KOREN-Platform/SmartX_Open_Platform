//   /lib/models/crmModel.ts
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const SDNControllerSchema = new Schema({}, {collection: 'playground-controllers-list'});
