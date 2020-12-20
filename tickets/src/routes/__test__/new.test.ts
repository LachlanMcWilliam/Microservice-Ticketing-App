import request from "supertest";
import { app } from "../../app";

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
  // Add in check in a check to make sure a ticket was created
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({ title: "Jaws", price: 10 });

  expect(response.status).toEqual(201);
});
