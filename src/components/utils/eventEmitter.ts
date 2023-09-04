type EventHandler = (...args: any[]) => void;
type Obj = Record<string, any>;

export class Emitter {
  public static events: Obj = {};

  public static on(key: string, func: any | EventHandler): void {
    if (!(key in this.events)) this.events[key] = [];
    this.events[key].push(func);
  }

  public static emit(key: string, ...args: any[] | EventHandler[]): void {
    this.events[key]?.forEach((func: EventHandler) => func(...args));
  }
}
