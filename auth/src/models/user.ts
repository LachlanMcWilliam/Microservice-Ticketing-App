import mongoose from "mongoose";
import { Password } from "../services/password";

//An Interface to describe the attributes when creating a new user
interface UserAttrs {
  email: string;
  password: string;
}

//An Interface to describe the attributes a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

//An Interface to describe the properties of a User Document
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        // Reformat the 'id' property's naming convention
        ret.id = ret._id;
        delete ret._id;

        // Delete the hashed password and version key from the return object
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
