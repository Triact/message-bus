import { IHandleMessages } from 'message-bus.core/dist/interfaces';
import BakeCake from '../messages/BakeCake';
//import BakeCake from '../messages/BakeCake';

export default class Bakery implements IHandleMessages<BakeCake> {
    
    handle = (msg: BakeCake) => {

        console.log(`Baking cake ${msg.type}`);
    }
}