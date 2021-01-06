import { Stan } from "node-nats-streaming";
import { Event } from "../interfaces/base-event";

abstract class Publisher<T extends Event> {
  abstract readonly subject: T["subject"];
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        console.log(data);

        resolve();
      });
    });
  }
}

export { Publisher as AbstractPublisher };
