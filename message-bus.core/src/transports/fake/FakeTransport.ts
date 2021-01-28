import * as interfaces from "../../interfaces";
import { interfaces as inversifyInterfaces } from 'inversify';
import FakeTransportImplementation from "./FakeTransportImplementation";

export class FakeTransport implements interfaces.ITransport {
    
    constructor(visitor: interfaces.ITransportConfigurationVisitor) {

        visitor.configureTransport((container: inversifyInterfaces.Container) => {
            container.bind(interfaces.TYPES.ITransportImplementation).to(FakeTransportImplementation).inSingletonScope();
        });
    }
}
