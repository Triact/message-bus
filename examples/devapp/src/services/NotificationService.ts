import { injectable } from "inversify";

@injectable()
export default class NotificationService {

    notify = (text: string) => {
        console.log(`NOTIFICATION: ${text}`);
    }
}