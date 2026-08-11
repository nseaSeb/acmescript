class ClientPubSub {
  constructor() {
    this.topics = new Map();
  }

  subscribe(topic, callback) {
    if (!this.topics.has(topic)) this.topics.set(topic, new Set());
    this.topics.get(topic).add(callback);
    return () => this.topics.get(topic)?.delete(callback); // unsubscribe
  }

  broadcast(topic, payload) {
    const listeners = this.topics.get(topic);
    if (listeners) {
      listeners.forEach((fn) => fn(payload));
    }
  }
}

export const PubSub = new ClientPubSub();
