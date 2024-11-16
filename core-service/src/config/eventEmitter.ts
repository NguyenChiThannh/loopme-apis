import { INotification } from './../models/notification';
import { EventEmitter } from 'events';

class NotificationEmitter extends EventEmitter { }

const notificationEmitter = new NotificationEmitter();

export default notificationEmitter;
export { INotification };