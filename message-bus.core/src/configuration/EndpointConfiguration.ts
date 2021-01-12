import { Container } from "inversify";
import HandlingConfiguration from "./HandlingConfiguration";
import RoutingConfiguration from "./RoutingConfiguration";
import * as interfaces from '../interfaces'

export interface IProvideEndpointConfiguration {
    endpointName: string;
    routing: RoutingConfiguration;
    handling: HandlingConfiguration;
    transport: interfaces.ITransport;
}

export default class EndpointConfiguration implements IProvideEndpointConfiguration {
    endpointName: string;
    container: Container;
    routing = new RoutingConfiguration();
    handling = new HandlingConfiguration();
    transport: interfaces.ITransport;
}