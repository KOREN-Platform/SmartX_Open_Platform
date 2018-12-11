//   /lib/models/crmModel.ts
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const OverlayLatencySchema = new Schema({}, {collection: 'daily-report-latency-data-raw'});
