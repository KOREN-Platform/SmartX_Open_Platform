//   /lib/models/crmModel.ts
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const BoxSchema = new Schema({
    boxID: {
        type: String
    },
    boxName: {
        type: String
    },
    boxType: {
        type: String            
    },
    site: {
        type: String            
    },
    management_ip: {
        type: String            
    },
    data_ip: {
        type: String
    },
    control_ip: {
        type: String
    },
    management_ip_status: {
        type: String
    },
    data_ip_status: {
        type: String
    },
    control_ip_status: {
        type: String
    },
    playground: {
        type: String
    },
    boxcode: {
        type: String
    }
}, {collection: 'pbox-list'});
