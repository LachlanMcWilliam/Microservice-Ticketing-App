import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

it("returns 404 if ticket not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const res = await request(app).get(`/api/tickets/${id}`).send().expect(404);

  console.log(res.body);
});

it("returns the ticket if it is found", async () => {
  // I differ from Stephen a little here, as he addresses in the video would
  // argue that having requests to other endpoints over saturates the scope of this test
  // I would agree with that so instead I will directly save a ticket in the test in order
  // to not test twice.

  // Create the ticket
  const ticket = Ticket.build({
    title: "Jaws",
    price: 20,
    userId: "testingId",
  });
  await ticket.save();

  // Checks there is a ticket saved
  const tickets = await Ticket.find({});
  expect(tickets.length).not.toEqual(0);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${ticket._id}`)
    .send();

  expect(ticketResponse.body.price).toEqual(20);
  expect(ticketResponse.body.title).toEqual("Jaws");
});
