import * as interfaces from "../interfaces";
import { interfaces as inversifyInterfaces } from 'inversify';

export class FakeTransport implements interfaces.ITransport {
    
    configure = (container: inversifyInterfaces.Container) => {
    }
}
