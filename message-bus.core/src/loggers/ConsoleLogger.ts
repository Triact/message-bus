import { injectable } from "inversify";
import { ILogger } from "../interfaces";

@injectable()
export class ConsoleLogger implements ILogger {
    debug(text: string, ...data: any[]): void {
        this.log('\x1b[32m', text, ...data);
    }

    info(text: string, ...data: any[]): void {
        this.log('\x1b[36m', text, ...data);
    }

    warning(text: string, ...data: any[]): void {
        this.log('\x1b[33m', text, ...data);
    }

    error(text: string, ...data: any[]): void {
        this.log('\x1b[31m', text, ...data);
    }

    fatal(text: string, ...data: any[]): void {
        this.log('\x1b[40m', text, ...data);
    }

    private log = (color:string, text: string, ...data: any[]) => {
        //console.log(`${color}%s\x1b[0m`, text, ...data);
        console.log(`${color}`, text, ...data, `\x1b[0m`);
    }
}

