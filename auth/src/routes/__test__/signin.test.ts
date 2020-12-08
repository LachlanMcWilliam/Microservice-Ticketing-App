import request from "supertest";
import { app } from "../../app";

// CHECKS FOR USERNAME AND PASSWORD VALIDITY

it("returns a 400 with invalid email", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({ email: "testtest.com", password: "password" })
    .expect(400);
});

it("returns a 400 missing email and password", async () => {
  return request(app).post("/api/users/signin").send({}).expect(400);
});

it("returns a 400 missing email or password", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ password: "password" })
    .expect(400);

  return request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com" })
    .expect(400);
});

// FLOW TESTS

it("fails when a email that does not exist is supplied", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "password" })
    .expect(400);
});

it("fails when an incorrect password for a user account is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  return request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "prd" })
    .expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "password" })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
