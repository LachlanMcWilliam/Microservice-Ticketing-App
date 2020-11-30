import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { RequestValidationError } from "../errors/request-validation-error";
import { BadRequestError } from "../errors/bad-request-error";

import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    // If errors are found in user input throw validation error
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    // If user already exists throw a an error
    if (existingUser) {
      throw new BadRequestError("Email is already in use");
    }

    // Create and save user
    const user = User.build({ email, password });
    await user.save();

    // Generate JWT and store it on 'session' object
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    //Store the jwt in the session object
    req.session = {
      jwt: userJwt,
    };

    return res.status(201).send(user);
  }
);

// router.get("/api/users/signup", (req, res) => {
// res.send("hello");
// });

export { router as signUpRouter };
