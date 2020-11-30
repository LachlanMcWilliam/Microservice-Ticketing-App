import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { BadRequestError } from "../errors/bad-request-error";

import { User } from "../models/user";
import { validateRequest } from "../middleware/validate-request";
import { Password } from "../services/password";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must provide a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    // Generate JWT and store it on 'session' object
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    //Store the jwt in the session object
    req.session = {
      jwt: userJwt,
    };

    return res.status(200).send(existingUser);
  }
);

export { router as signInRouter };
