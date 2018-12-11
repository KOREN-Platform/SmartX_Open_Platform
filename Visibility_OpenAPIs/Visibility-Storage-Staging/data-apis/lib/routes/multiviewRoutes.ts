// /lib/routes/multiviewRoutes.ts
import {Request, Response, NextFunction} from "express";
import { SDNContController, OverlayController, BoxController, VMInstanceSchema, IoTHostSchema } from "../controllers/multiviewController";

export class Routes {    

    public sdnController: SDNContController = new SDNContController()
	public overlayController: OverlayController = new OverlayController()
    public boxController: BoxController = new BoxController()
	public vminstanceController: VMInstanceSchema = new VMInstanceSchema()
	public iothostController: IoTHostSchema = new IoTHostSchema()

    public routes(app): void {          
        app.route('/')
        .get((req: Request, res: Response) => {            
            res.status(200).send({
                message: 'Multi-View Data API server is running!!!'
            })
        })

        // SmartX Controller List
        app.route('/getcontrollersstatus')
        .get((req: Request, res: Response, next: NextFunction) => {
            // middleware
            console.log(`Request from: ${req.originalUrl}`);
            console.log(`Request type: ${req.method}`);
            next();
        }, this.sdnController.getSDNCont)

        // Overlay-restricted Topology Data
        app.route('/getoverlaylatency')
        .get((req: Request, res: Response, next: NextFunction) => {
            // middleware
            console.log(`Request from: ${req.originalUrl}`);
            console.log(`Request type: ${req.method}`);
            next();
        }, this.overlayController.getLatency)

        // Overlay-restricted Topology Data (timestamp)
        app.route('/getoverlaylatency/:SmartX-Box-Source')
        // get specific contact
        .get(this.overlayController.getLatencyWithBoxID)

        // SmartX Box List
        app.route('/getboxesstatus')
        .get((req: Request, res: Response, next: NextFunction) => {
            // middleware
            console.log(`Request from: ${req.originalUrl}`);
            console.log(`Request type: ${req.method}`);
            next();
        }, this.boxController.getBox)
		
		// OpenStack VM Instances List
        app.route('/getvminstancesstatus')
        .get((req: Request, res: Response, next: NextFunction) => {
            // middleware
            console.log(`Request from: ${req.originalUrl}`);
            console.log(`Request type: ${req.method}`);
            next();
        }, this.vminstanceController.getVMInstances)
		
		// Connected IoT Hostss List
        app.route('/getiothostsstatus')
        .get((req: Request, res: Response, next: NextFunction) => {
            // middleware
            console.log(`Request from: ${req.originalUrl}`);
            console.log(`Request type: ${req.method}`);
            next();
        }, this.iothostController.getIoTHosts)
         
    }
}
