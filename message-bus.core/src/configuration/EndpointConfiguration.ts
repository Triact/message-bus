import { interfaces as inversityInterfaces, Container, injectable } from "inversify";
import HandlingConfiguration from "./HandlingConfiguration";
import RoutingConfiguration from "./RoutingConfiguration";
import * as interfaces from '../interfaces'

export interface IProvideEndpointConfiguration {
    endpointName: string;
    routing: RoutingConfiguration;
    handling: HandlingConfiguration;
    transport: interfaces.ITransportImplementation;
}

@injectable()
export default class EndpointConfiguration implements IProvideEndpointConfiguration {
    endpointName: string;
    routing = new RoutingConfiguration();
    handling = new HandlingConfiguration();
    transport: interfaces.ITransportImplementation;
}