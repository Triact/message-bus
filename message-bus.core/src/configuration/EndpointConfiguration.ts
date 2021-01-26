import { interfaces as inversityInterfaces, Container, injectable } from "inversify";
import HandlingConfiguration from "./HandlingConfiguration";
import RoutingConfiguration from "./RoutingConfiguration";
import * as interfaces from '../interfaces'

export interface IProvideEndpointConfiguration {
    endpointName: string | undefined;
    routing: RoutingConfiguration;
    transport: interfaces.ITransportImplementation | undefined;
}

@injectable()
export default class EndpointConfiguration implements IProvideEndpointConfiguration {
    endpointName: string | undefined;
    routing = new RoutingConfiguration();
    transport: interfaces.ITransportImplementation | undefined;
}