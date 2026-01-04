import { model, models, Schema } from "mongoose";

const accountSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, unique: true },
    providerId: { type: String, required: true },
  },
  {
    collection: "account",
  }
);

export const Account = models.Account || model("Account", accountSchema);
