interface Events {
  [eventName: string]: Array<(...args: unknown[]) => void>;
}

class EventHub {
  private events: Events = {};

  /**
   * Subscribe to the event.
   * 
   * @param eventName
   * @param callback
   * @returns {number} The id of the callback
   */
  public subscribe(eventName: string, callback: (...args: unknown[]) => void): number {
    if (!this.events[eventName]) {
      this.events[eventName] = [callback];
    }
    this.events[eventName].push(callback);
    return this.events[eventName].length - 1;
  }

  /**
   * Subscribe to the event once, when the event is dispatched, the callback will be destroyed after execution.
   * 
   * @param eventName
   * @param callback
   */
  public subscribeOnce(eventName: string, callback: (...args: unknown[]) => void): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    const wrapper = (...args: unknown[]) => {
      callback(args);
      // Don't use the splice method, otherwise the ids of the rest of the callbacks will be confused.
      this.events[eventName][this.events[eventName].length] = undefined;
    }
    this.events[eventName].push(wrapper);
  }

  /**
   * Unsubscribe form the event through the callback id.
   * 
   * @param eventName 
   * @param token Callback id
   */
  public unsubscribe(eventName: string, token: number): void {
    if (!this.events[eventName]) {
      return;
    }
    // Don't use the splice method, otherwise the ids of the rest of the callbacks will be confused.
    this.events[eventName][token] = undefined;
  }

  /**
   * Dispatch an event.
   * 
   * @param eventName 
   * @param params 
   */
  public dispatch(eventName: string, ...params: unknown[]): void {
    if (!this.events[eventName]) {
      throw new Error('Event' + eventName + 'is not subscribed.');
    }
    this.events[eventName].forEach(callback => {
      callback(params);
    });
  }

  /**
   * Destory an event.
   * 
   * @param eventName 
   */
  public destroy(eventName: string): void {
    this.events[eventName] = [];
  }
}
