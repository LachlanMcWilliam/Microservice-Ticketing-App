import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("ticketing", "test");

stan.on("connect", async () => {
  console.log("Publish connected to NATS");

  const publisher = new TicketCreatedPublisher(stan);

  try {
    await publisher.publish({
      id: "123",
      title: "Lockdown 2: Electric Boogaloo",
      price: 1,
    });
  } catch (err) {
    console.error(err);
  }

  // const data = JSON.stringify({
  //   id: "123",
  //   title: "concert",
  //   price: 20,
  // });

  // stan.publish("ticket:created", data, () => {
  //   console.log("Event published:", data);
  // });
});
