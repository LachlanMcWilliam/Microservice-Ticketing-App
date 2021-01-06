import { AbstractPublisher } from "./abstract-classes/abstract-publisher";
import { TicketCreatedEvent } from "./interfaces/ticket-created-event";
import { Subjects } from "./enums/subjects";

export class TicketCreatedPublisher extends AbstractPublisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
