type EventHandler<T> = (...args: T[]) => void;
type Obj = Record<string, any>;

export class Emitter {
  public static events: Obj = {};

  public static on<T>(key: string, func: EventHandler<T>): void {
    if (!(key in this.events)) this.events[key] = [];
    this.events[key].push(func);
  }

  public static emit<T>(key: string, ...args: T[]): void {
    this.events[key]?.forEach((func: EventHandler<T>): void => func(...args));
  }
}