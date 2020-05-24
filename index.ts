interface Events {
  [eventName: string]: Function[];
}

class EventHub {
  private events: Events = {};

  public discribe(eventName: string, callback: () => void) {
    if (!this.events[eventName]) {
      this.events[eventName] = [callback];
    }

    this.events[eventName].push(callback);
  }

  public undiscribe(eventName: string, callback: () => void) {
    if (!this.events[eventName]) {
      return;
    }

    const index = this.events[eventName].indexOf(callback);

    if (index > 0) {
      this.events[eventName].splice(index, 1);
    }
  }

  public dispatch(eventName: string, ...params: any[]) {
    if (!this.events[eventName]) {
      throw new Error('Event' + eventName + 'is not subscribed.');
    }

    this.events[eventName].forEach(callback => {
      callback(params);
    });
  }
}
