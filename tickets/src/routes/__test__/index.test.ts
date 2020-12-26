import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

const ticketArray = [
  { title: "Jaws", price: 20 },
  { title: "Avatar", price: 20 },
  { title: "Concert", price: 20 },
  { title: "The Last Airbender 🤮", price: 0.5 },
  { title: "Joker", price: 20 },
  { title: "1917", price: 20 },
  { title: "Ford vs Ferrari", price: 20 },
];

const populateTickets = async () => {
  for (let ticket of ticketArray) {
    const ticketModel = Ticket.build({
      title: ticket.title,
      price: ticket.price,
      userId: "testingId",
    });
    await ticketModel.save();
  }
};

it("can fetch a list of tickets", async () => {
  await populateTickets();
  // Check all the tickets were added
  const tickets = await Ticket.find({});
  expect(tickets.length).toEqual(ticketArray.length);

  const res = await request(app).get("/api/tickets").send().expect(200);
  expect(res.body.length).toEqual(ticketArray.length);
});
