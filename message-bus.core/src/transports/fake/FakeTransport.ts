import * as interfaces from "../../interfaces";
import { interfaces as inversifyInterfaces } from 'inversify';
import FakeTransportImplementation from "./FakeTransportImplementation";

export class FakeTransport implements interfaces.ITransport {
    
    configure = (container: inversifyInterfaces.Container) => {
        if (!container) throw new Error(`Argument 'container' cannot be null.`);
        container.bind(interfaces.TYPES.ITransportImplementation).to(FakeTransportImplementation).inSingletonScope();
    }
}
