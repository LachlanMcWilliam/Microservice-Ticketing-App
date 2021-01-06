import { AbstractListener } from "./abstract-classes/abstract-listener";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "./interfaces/ticket-created-event";
import { Subjects } from "./enums/subjects";

class TicketCreatedListener extends AbstractListener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Event Data:", data);
    console.log();

    msg.ack();
  }
}

export { TicketCreatedListener };
