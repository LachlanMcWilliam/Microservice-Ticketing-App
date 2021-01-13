import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { TicketCreatedPublisher } from "../../events/publishers/ticket-created-publisher";

it("has a route handler listening to api/tickets for POST requests", async () => {
  const response = await await request(app).post("/api/tickets").send({});

  return expect(response.status).not.toEqual(404);
});

it("can only be accessed if user signed in", async () => {
  const response = await await request(app).post("/api/tickets").send({});

  return expect(response.status).toEqual(401);
});

it("returns a status other than 401 if user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({});

  return expect(response.status).not.toEqual(401);
});

it("returns an error if invalid title is provided", async () => {
  const responseEmpty = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({ title: "", price: 10 });

  expect(responseEmpty.status).toEqual(400);

  const responseMissing = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({ price: 10 });

  expect(responseMissing.status).toEqual(400);
});

it("returns an error if an invalid price is provided", async () => {
  const responseEmpty = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({ title: "Jaws", price: -10 });

  expect(responseEmpty.status).toEqual(400);

  const responseMissing = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({ title: "Jaws" });

  expect(responseMissing.status).toEqual(400);
});

it("creates a ticket with valid inputs", async () => {
  const cookie = global.signup();

  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = "asldkfj";

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title,
      price: 20,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual(title);
});
