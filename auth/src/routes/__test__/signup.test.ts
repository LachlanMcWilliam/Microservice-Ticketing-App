import { response } from "express";
import request from "supertest";
import { app } from "../../app";

// CHECK FOR PROPER RETURN WITH VALID INPUTS

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);
});

// CHECKS FOR USERNAME AND PASSWORD VALIDITY

it("returns a 400 with invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "testtest.com", password: "password" })
    .expect(400);
});

it("returns a 400 with invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "p" })
    .expect(400);
});

it("returns a 400 missing email and password", async () => {
  return request(app).post("/api/users/signup").send({}).expect(400);
});

it("returns a 400 missing email or password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ password: "password" })
    .expect(400);

  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com" })
    .expect(400);
});

// FLOW TESTS

it("does not allow duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
