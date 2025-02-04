// Event driven
import { EventEmitter } from 'events';

class NotificationEmitter extends EventEmitter { }

const notificationEmitter = new NotificationEmitter();

export { notificationEmitter }
