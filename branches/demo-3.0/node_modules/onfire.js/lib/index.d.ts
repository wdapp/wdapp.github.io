/**
 * mini (~500 b) version for event-emitter.
 *
 * Created by hustcc on 2018/12/31
 * Contract: vip@hust.edu.cn
 */
export interface Listener {
    cb: Function;
    once: boolean;
}
export interface EventsType {
    [eventName: string]: Listener[];
}
/**
 * const ee = new OnFire();
 *
 * ee.on('click', (...values) => {});
 *
 * ee.on('mouseover', (...values) => {});
 *
 * ee.emit('click', 1, 2, 3);
 * ee.fire('mouseover', {}); // same with emit
 *
 * ee.off();
 */
export default class OnFire {
    static ver: string;
    es: EventsType;
    on(eventName: string, cb: Function, once?: boolean): void;
    once(eventName: string, cb: Function): void;
    fire(eventName: string, ...params: any[]): void;
    off(eventName?: string, cb?: Function): void;
    emit(eventName: string, ...params: any[]): void;
}
