import 'reflect-metadata';
import * as interfaces from '../interfaces';

export class MessageHelper {

    static isOfPurpose = <T>(msg: T, messagePurpose: string): boolean => MessageHelper.getMessagePurpose(msg) === messagePurpose;

    static isCommand = <T>(msg: T): boolean => MessageHelper.isOfPurpose<T>(msg, interfaces.MessagePurposes.COMMAND);
    static isEvent = <T>(msg: T): boolean => MessageHelper.isOfPurpose<T>(msg, interfaces.MessagePurposes.EVENT);

    static getMessagePurpose = <T>(msg: T): string => Reflect.getMetadata(interfaces.MessageMetadataKeys.MessagePurpose, msg);
    static getMessageType = <T>(msg: T): interfaces.MessageType => Reflect.getMetadata(interfaces.MessageMetadataKeys.MessageType, msg);
}