//   /lib/controllers/multiviewController.ts
import * as mongoose from 'mongoose';
import { SDNControllerSchema } from '../models/sdncontModel';
import { OverlayLatencySchema } from '../models/overlaypmModel';
import { BoxSchema } from '../models/multiviewModel';
import { VMInstanceStatusSchema } from '../models/vminstanceModel';
import { IoTHostStatusSchema } from '../models/iothostModel';
import { Request, Response } from 'express';

const SDNCont = mongoose.model('SDNCont', SDNControllerSchema);
const OverlayLatency = mongoose.model('OverlayLatency', OverlayLatencySchema);
const Box = mongoose.model('Box', BoxSchema);
const VMInstance = mongoose.model('VMInstance', VMInstanceStatusSchema);
const IoTHost = mongoose.model('IoTHost', IoTHostStatusSchema);

export class SDNContController{
    public getSDNCont (req: Request, res: Response) {
        SDNCont.find({}, (err, list) => {
            if(err){
                res.send(err);
            }
            res.json(list);
        });
    }
}

export class BoxController{
    public addNewBox (req: Request, res: Response) {                
        let newBox = new Box(req.body);
    
        newBox.save((err, box) => {
            if(err){
                res.send(err);
            }    
            res.json(box);
        });
    }

    public getBox (req: Request, res: Response) {           
        Box.find({}, (err, box) => {
            if(err){
                res.send(err);
            }
            res.json(box);
        });
    }
}

export class OverlayController{
    public getLatency (req: Request, res: Response) {
        OverlayLatency.find({}, (err, latency) => {
            if(err){
                res.send(err);
            }
            res.json(latency);
        });
    }

    public getLatencyWithBoxID (req: Request, res: Response) {
        OverlayLatency.findById(req.params.Source, (err, latency) => {
            if(err){
                res.send(err);
            }
            res.json(latency);
        });
    }
}

export class VMInstanceSchema{
    public getVMInstances (req: Request, res: Response) {
        VMInstance.find({}, (err, list) => {
            if(err){
                res.send(err);
            }
            res.json(list);
        });
    }
}

export class IoTHostSchema{
    public getIoTHosts (req: Request, res: Response) {
        IoTHost.find({}, (err, list) => {
            if(err){
                res.send(err);
            }
            res.json(list);
        });
    }
}
