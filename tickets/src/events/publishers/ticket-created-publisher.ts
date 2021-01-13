import {
  AbstractPublisher,
  Subjects,
  TicketCreatedEvent,
} from "@lm-tickets/common";

export class TicketCreatedPublisher extends AbstractPublisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
