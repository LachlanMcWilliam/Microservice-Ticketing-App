import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

// So if you see these tests I tried to write most of them without watching the video to try practice.
// They are most likely crap so please dont judge too hard :Pz

it("returns 404 if ticket id not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signup())
    .send({ title: "Jaws", price: 20 })
    .expect(404);
});

it("returns 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "Jaws", price: 20 })
    .expect(401);
});

it("returns 401 if the user does not own the ticket", async () => {
  const userId = "testingId";
  // Really unnecessary but garantees the user ids will be different
  const cookie = global.signup(userId.split("").reverse().join());
  console.log(userId.split("").reverse().join(""));

  // Create a ticket
  const ticket = Ticket.build({
    title: "Jaws",
    price: 20,
    userId,
  });
  await ticket.save();

  // Confirm the ticket was saved
  const ticketCollection = await Ticket.find({});
  expect(ticketCollection.length).toEqual(1);

  await request(app)
    .put(`/api/tickets/${ticket._id}`)
    .set("Cookie", cookie)
    .send({ title: "Jaws 2", price: 30 })
    .expect(401);
});

it("returns 400 if the user provides an invalid title or price", async () => {
  const userId = "testingId";
  const cookie = global.signup(userId);

  // Create a ticket
  const ticket = Ticket.build({
    title: "Jaws",
    price: 20,
    userId,
  });
  await ticket.save();

  // Confirm the ticket was saved
  const ticketCollection = await Ticket.find({});
  expect(ticketCollection.length).toEqual(1);

  // Check for empty title
  await request(app)
    .put(`/api/tickets/${ticket._id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 30 })
    .expect(400);

  // Check for negative price
  await request(app)
    .put(`/api/tickets/${ticket._id}`)
    .set("Cookie", cookie)
    .send({ title: "Jaws 2", price: -10 })
    .expect(400);

  // Check for missing title
  await request(app)
    .put(`/api/tickets/${ticket._id}`)
    .set("Cookie", cookie)
    .send({ price: 10 })
    .expect(400);

  // Check for missing price
  await request(app)
    .put(`/api/tickets/${ticket._id}`)
    .set("Cookie", cookie)
    .send({ title: "Jaws 2" })
    .expect(400);
});

it("updates a ticket if provided valid inputs ", async () => {
  const userId = "testingId";
  const cookie = global.signup(userId);

  // Create a ticket
  const ticket = Ticket.build({
    title: "Jaws",
    price: 20,
    userId,
  });
  await ticket.save();

  // Confirm the ticket was saved
  const ticketCollection = await Ticket.find({});
  expect(ticketCollection.length).toEqual(1);

  // Send the update request
  const updatedName = "Jaws 2";
  const updatedPrice = 30;

  await request(app)
    .put(`/api/tickets/${ticket._id}`)
    .set("Cookie", cookie)
    .send({ title: updatedName, price: updatedPrice })
    .expect(200);

  // Check if the updated title has been added to db
  const updatedTicket = await Ticket.findById(ticket._id);

  expect(updatedTicket).not.toEqual(null);

  expect(updatedTicket!.title).toEqual(updatedName);
  expect(updatedTicket!.price).toEqual(updatedPrice);
});
